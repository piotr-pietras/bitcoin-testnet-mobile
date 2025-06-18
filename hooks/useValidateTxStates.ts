import { AccountBTC } from "@/services/btc/AccountBTC";
import { OP_RETURN_MAX_SIZE } from "@/services/btc/constsBTC";
import { TransactionBTC } from "@/services/btc/TransactionBTC";
import { WalletStoredInfo } from "@/services/storage";
import { UTXO } from "@/types/global";
import { useEffect, useState } from "react";
import validator from "validator";

const FAKE_PRIV_KEY = new Uint8Array(32).fill(1);

type ValidationStates = {
  wallet: WalletStoredInfo;
  address: string;
  amount: string;
  feeRate: string;
  opReturnData: string;
  selectedUtxos: UTXO[];
};

type ValidatedSectionKeys = {
  utxos?: string;
  address?: string;
  amount?: string;
  feeRate?: string;
  opReturnData?: string;
  exchange?: string;
  fee?: string;
  size?: string;
  spendable?: string;
};

// TODO: refactor please
const validateStates = async (states: ValidationStates) => {
  const account = new AccountBTC(
    FAKE_PRIV_KEY,
    states.wallet.net,
    states.wallet.type
  );
  const transaction = new TransactionBTC(
    account,
    states.selectedUtxos,
    "virtual"
  );
  await transaction.create(
    states.address || "0",
    Number(states.amount) || 0,
    Number(states.feeRate) || 0,
    { opReturnData: states.opReturnData }
  );
  const { error, info, size, fee, utxos, spendable, balance, exchange } =
    transaction;

  let sectionError = new Map<keyof ValidatedSectionKeys, string>();
  let sectionInfo = new Map<keyof ValidatedSectionKeys, string>();

  sectionInfo.set("size", `⚓ TX size is estimated to be ${size} bytes`);
  sectionInfo.set("fee", `👀 Fee is estimated to be ${fee} satoshi`);
  sectionInfo.set("spendable", `💰 Spendable amount is ${spendable} satoshi`);
  sectionInfo.set(
    "utxos",
    `🎨 ${utxos.length} UTXOs contains ${balance} satoshi`
  );
  sectionInfo.set(
    "exchange",
    `↩ Exchange returned to you is ${transaction.exchange} satoshi`
  );

  if (states.address && error.get("INVALID_RECIPIENT")) {
    sectionError.set("address", "Invalid bitcoin address");
  }

  if (states.amount && error.get("NOT_ENOUGH_FUNDS"))
    sectionError.set("amount", "Not enough funds");
  if (states.amount && !validator.isInt(states.amount))
    sectionError.set("amount", "Amount must be integer");
  if (states.amount && error.get("VALUE_IS_DUST"))
    sectionError.set("amount", "Amount is unspendable dust");
  if (states.selectedUtxos && states.selectedUtxos.length === 0)
    sectionError.set("amount", "No UTXOs selected");

  if (
    states.amount &&
    info.get("EXCHANGE_IS_DUST") &&
    !sectionError.get("amount") &&
    transaction.exchange &&
    transaction.exchange > 0
  )
    sectionInfo.set(
      "amount",
      `📢 Exchange in amount of ${exchange} satoshi is consider as a dust and cannot be returned to you. You can add another UTXOs to transaction or send all spendable amount to recipient.`
    );

  if (Number(states.feeRate) < 1)
    sectionError.set("feeRate", "Fee rate must be at least 1");
  if (states.feeRate && !validator.isInt(states.feeRate))
    sectionError.set("feeRate", "Fee rate must be integer");

  if (states.opReturnData && error.get("OP_RETURN_DATA_TOO_LARGE"))
    sectionError.set(
      "opReturnData",
      `Data exceeds ${OP_RETURN_MAX_SIZE} bytes`
    );

  return { error: sectionError, info: sectionInfo, transaction };
};

interface Props {
  wallet: WalletStoredInfo | null;
  address: string;
  amount: string;
  feeRate: string;
  opReturnData: string;
  selectedUtxos: UTXO[];
}

export const useValidateTxStates = (props: Props) => {
  const [transaction, setTransaction] = useState<TransactionBTC | null>(null);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [error, setError] = useState<Map<keyof ValidatedSectionKeys, string>>(
    new Map()
  );
  const [info, setInfo] = useState<Map<keyof ValidatedSectionKeys, string>>(
    new Map()
  );

  useEffect(() => {
    if (!props.wallet) return;
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => {
      validateStates({ ...props, wallet: props.wallet! }).then(
        ({ error, info, transaction }) => {
          setError(error);
          setInfo(info);
          setTransaction(transaction);
        }
      );
    }, 250);
    setTimeoutId(id);
  }, [
    props.wallet,
    props.address,
    props.amount,
    props.feeRate,
    props.opReturnData,
    props.selectedUtxos,
  ]);

  return { error, info, transaction };
};
