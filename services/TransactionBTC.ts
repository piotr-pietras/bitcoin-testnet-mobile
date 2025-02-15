import { Psbt, networks, payments } from "bitcoinjs-lib";
import { Net, UTXO } from "@/types/global";
import { AccountBTC } from "./AccountBTC";
import { btcApi } from "./api/btc";

interface Input {
  hash: string;
  index: number;
  nonWitnessUtxo?: Buffer;
  witnessUtxo?: {
    script: Buffer;
    value: number;
  };
}

export class TransactionBTC {
  private account: AccountBTC;
  private utxos: UTXO[];

  static feeRateUnit = "sats/vB";

  private psbt?: Psbt;
  txid?: string;
  fee?: number; //satoshi
  feeRate?: number; //satoshi / bytes
  value?: number;
  address?: string;

  constructor(account: AccountBTC, utxos: UTXO[]) {
    this.account = account;
    this.utxos = utxos;
  }

  public async create(
    address: string,
    value: number,
    feeRate: number,
    options?: { rbf?: boolean; opReturnData?: string }
  ) {
    if (this.txid) throw new Error("Transaction is already done");

    this.value = value;
    this.address = address;
    this.feeRate = feeRate;

    const { net } = this.account;
    const network = this.getNetwork(net);

    let inputs: Input[];
    let size: number;
    if (this.account.type === "p2pkh") {
      inputs = await this.prepareP2pkhInputs();
      size = this.calcTxSizeP2pkh(inputs.length, 2);
    } else if (this.account.type === "p2wpkh") {
      inputs = await this.prepareP2wpkhInputs();
      size = this.calcTxSizeP2wpkh(inputs.length, 2);
    } else {
      throw new Error("Account type is invalid");
    }

    if (options?.opReturnData) {
      const extraSize = Buffer.from(options.opReturnData, "utf8").byteLength;
      size += extraSize + 4;
    }

    this.fee = size * feeRate;
    const outputs = this.prepareOutputs(
      address,
      this.value,
      this.fee,
      options?.opReturnData
    );

    this.psbt = new Psbt({ network }).addInputs(inputs).addOutputs(outputs);
    if (!this.psbt) throw new Error("Psbt has not been created");
    if (options?.rbf) {
      inputs.forEach((_, i) => this.psbt?.setInputSequence(i, 0xffffffff - 2));
    }
    return this;
  }

  public calcTxSizeP2pkh = (inLength: number, outLength: number) => {
    const inBytes = 180;
    const outBytes = 36;
    return inBytes * inLength + outBytes * outLength + 10;
  };

  private async prepareP2pkhInputs() {
    return Promise.all<Input>(
      this.utxos.map(
        ({ tx_id, index }) =>
          new Promise(async (resolve) => {
            const { result } = await btcApi.getRawTx(tx_id);
            resolve({
              hash: tx_id,
              index,
              nonWitnessUtxo: Buffer.from(result, "hex"),
            });
          })
      )
    );
  }

  public calcTxSizeP2wpkh(inLength: number, outLength: number) {
    const overhead = 11;
    const inBytes = 68;
    const outBytes = 31;
    return overhead + inLength * inBytes + outLength * outBytes;
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

  private prepareOutputs(
    address: string,
    value: number,
    fee: number,
    opReturnData?: string
  ) {
    const balance = this.utxos.reduce((p, c) => p + c.value, 0);
    if (balance - value - fee < 0) throw new Error("Not enough funds");
    const outputs: {
      address: string;
      value: number;
      script?: any;
    }[] = [
      {
        address,
        value: Number(value),
      },
      {
        address: this.account.address,
        value: Number(balance - value - fee),
      },
    ];

    if (opReturnData) {
      const data = Buffer.from(opReturnData, "utf8");
      if (data.byteLength > 80) throw new Error("OP_RETURN data size exceeded");
      const embed = payments.embed({ data: [data] });
      outputs.push({ value: 0, script: embed.output } as any);
    }

    return outputs;
  }

  public async sign() {
    if (this.txid) throw new Error("Transaction is already done");
    if (!this.psbt) throw new Error("PSBT has not been created");
    await this.psbt.signAllInputsAsync(this.account.ecPair);
    this.psbt.finalizeAllInputs();
  }

  public async send() {
    if (this.txid) throw new Error("Transaction is already done");
    if (!this.psbt) throw new Error("PSBT has not been created");

    const tx = this.psbt.extractTransaction().toHex();
    const res = await btcApi.submitSignedTx(tx);
    this.txid = res.id;
    return this.txid;
  }

  private getNetwork(net: Net) {
    const { bitcoin, testnet } = networks;
    return net === "MAIN" ? bitcoin : testnet;
  }
}
