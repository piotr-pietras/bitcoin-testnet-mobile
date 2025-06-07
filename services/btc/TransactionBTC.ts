import { Psbt, networks, payments } from "bitcoinjs-lib";
import { UTXO } from "@/types/global";
import { AccountBTC } from "./AccountBTC";
import { P2PKH_DUST, P2WPKH_DUST } from "./constsBTC";
import { btcApi } from "@/services/api/btc";
import { SizeBTC } from "./SizeBTC";
import { validate as addressValidate } from "bitcoin-address-validation";

const enum ErrorType {
  NOT_ENOUGH_FUNDS = "not_enough_funds",
  VALUE_IS_DUST = "value_is_dust",
  OP_RETURN_DATA_TOO_LARGE = "op_return_data_too_large",
  INVALID_ADDRESSEE = "invalid_addressee",
  INVALID_RECIPIENT = "invalid_recipient",
}

const enum InfoType {
  EXCHANGE_IS_DUST = "exchange_is_dust",
}

interface Input {
  hash: string;
  index: number;
  nonWitnessUtxo?: Buffer; // p2pkh
  witnessUtxo?: {
    // p2wpkh
    script: Buffer;
    value: number;
  };
}

export interface Output {
  address: string;
  value: number; //satoshi
  script?: any;
}

interface Options {
  rbf?: boolean; // it allows to create transaction with RBF
  opReturnData?: string; // it allows to create transaction with opReturn data
  noExchange?: boolean; // it sends all funds to recipient address
}

export class TransactionBTC {
  error = new Map<keyof typeof ErrorType, boolean | undefined>();
  info = new Map<keyof typeof InfoType, boolean | undefined>();
  private virtual = false;
  utxos: UTXO[];

  static feeRateUnit = "sats/vB";

  private psbt?: Psbt;
  txid?: string;
  size?: number; //bytes
  feeRate?: number; //satoshi / bytes
  fee?: number; //satoshi
  value?: number; //satoshi
  valueToUse?: number; //satoshi
  balance?: number; //satoshi
  spendable?: number; //satoshi
  exchange?: number; //satoshi
  address?: string;
  options?: Options;

  constructor(
    private readonly account: AccountBTC,
    utxos: UTXO[],
    virtual?: "virtual"
  ) {
    this.virtual = virtual === "virtual";
    this.utxos = utxos;
  }

  public async create(
    address: string,
    value: number,
    feeRate: number,
    options?: Options
  ) {
    if (this.txid)
      throw new Error("Transaction is already done in this instance");

    this.value = value;
    this.address = address;
    this.feeRate = feeRate;
    this.options = options;

    let inputs: Input[];
    if (this.account.type === "p2pkh") {
      inputs = await this.prepareP2pkhInputs();
    } else if (this.account.type === "p2wpkh") {
      inputs = await this.prepareP2wpkhInputs();
    } else {
      throw new Error("Account type is invalid");
    }

    this.size = SizeBTC.calcTxSize(
      this.account.type,
      inputs.length,
      this.options?.noExchange ? 1 : 2,
      this.options?.opReturnData
    );
    this.fee = this.size * feeRate;

    const outputs = this.prepareOutputs();
    if (this.info.get("EXCHANGE_IS_DUST") && !this.options?.noExchange) {
      this.error.clear();
      this.info.clear();
      await this.create(this.address, this.value, this.feeRate, {
        ...options,
        noExchange: true,
      });
      return this;
    }

    if (!this.virtual) {
      this.psbt = new Psbt({ network: networks.testnet })
        .addInputs(inputs)
        .addOutputs(outputs);
      if (!this.psbt) throw new Error("Psbt has not been created");
    }
    if (options?.rbf) {
      inputs.forEach((_, i) => this.psbt?.setInputSequence(i, 0xffffffff - 2));
    }
    return this;
  }

  private async prepareP2pkhInputs() {
    return Promise.all<Input>(
      this.utxos.map(
        ({ tx_id, index }) =>
          new Promise(async (resolve) => {
            const { result } = this.virtual
              ? {
                  result:
                    "0000000000000000000000000000000000000000000000000000000000000000",
                }
              : await btcApi.getRawTx(tx_id, this.account.net);
            resolve({
              hash: tx_id,
              index,
              nonWitnessUtxo: Buffer.from(result, "hex"),
            });
          })
      )
    );
  }

  private prepareP2wpkhInputs() {
    return Promise.all<Input>(
      this.utxos.map(
        ({ tx_id, index, value, script }) =>
          new Promise(async (resolve) => {
            if (!script) throw new Error("Utxo does not provide script");
            resolve({
              hash: tx_id,
              index,
              witnessUtxo: {
                script: Buffer.from(script, "hex"),
                value,
              },
            });
          })
      )
    );
  }

  private prepareOutputs(): Output[] {
    if (
      !this.address ||
      typeof this.fee !== "number" ||
      typeof this.value !== "number"
    )
      throw new Error("Create transaction first");
    this.balance = this.utxos.reduce((p, c) => p + c.value, 0);
    this.spendable = this.balance - this.fee;
    this.exchange = this.spendable - this.value;

    if (!this.account.address || !addressValidate(this.account.address))
      this.error.set("INVALID_ADDRESSEE", true);
    if (this.account.type === "p2pkh" && this.exchange < P2PKH_DUST)
      this.info.set("EXCHANGE_IS_DUST", true);
    if (this.account.type === "p2wpkh" && this.exchange < P2WPKH_DUST)
      this.info.set("EXCHANGE_IS_DUST", true);
    if (this.account.type === "p2pkh" && this.value < P2PKH_DUST)
      this.error.set("VALUE_IS_DUST", true);
    if (this.account.type === "p2wpkh" && this.value < P2WPKH_DUST)
      this.error.set("VALUE_IS_DUST", true);
    if (this.balance < this.value + this.fee) {
      this.error.set("NOT_ENOUGH_FUNDS", true);
      return [];
    }
    if (!this.address || !addressValidate(this.address)) {
      this.error.set("INVALID_RECIPIENT", true);
      return [];
    }

    this.valueToUse = this.value;
    if (this.info.get("EXCHANGE_IS_DUST")) {
      this.valueToUse = this.value + this.exchange;
    }

    const outputs: Output[] = [
      {
        address: this.address,
        value: Number(this.valueToUse),
      },
      ...(this.info.get("EXCHANGE_IS_DUST")
        ? []
        : [
            {
              address: this.account.address,
              value: Number(this.exchange),
            },
          ]),
    ];

    if (this.options?.opReturnData) {
      if (SizeBTC.isOpReturnDataTooLarge(this.options.opReturnData))
        this.error.set("OP_RETURN_DATA_TOO_LARGE", true);
      const embed = payments.embed({
        data: [Buffer.from(this.options.opReturnData, "utf8")],
      });
      outputs.push({ value: 0, script: embed.output } as any);
    }

    return outputs;
  }

  public async sign() {
    if (this.virtual) throw new Error("This is a virtual transaction");
    if (this.txid) throw new Error("Transaction is already done");
    if (!this.psbt) throw new Error("PSBT has not been created");
    await this.psbt.signAllInputsAsync(this.account.ecPair);
    this.psbt.finalizeAllInputs();
  }

  public async send() {
    if (this.virtual) throw new Error("This is a virtual transaction");
    if (this.txid) throw new Error("Transaction is already done");
    if (!this.psbt) throw new Error("PSBT has not been created");
    const tx = this.psbt.extractTransaction().toHex();
    const res = await btcApi.submitSignedTx(tx, this.account.net);
    this.txid = res.id;
    return this.txid;
  }
}
