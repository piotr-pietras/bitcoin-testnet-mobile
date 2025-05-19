import { AddressType, Net } from "@/types/global";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

export enum SECURE_STORE_KEYS {
  WALLETS = "WALLETS",
  INFO_FAUCAT = "INFO_FAUCAT",
}

export type WalletStoredInfo = {
  id: string;
  address: string;
  type: AddressType;
  name: string;
  net: Net;
};

export const saveWallet = async (
  privKey: Uint8Array,
  address: string,
  type: AddressType,
  net: Net,
  walletName?: string
) => {
  const id = Crypto.randomUUID();
  const name = walletName || id;
  const privKeyHex = Buffer.from(privKey).toString("hex");
  await SecureStore.setItemAsync(id, privKeyHex);
  const wallets = await SecureStore.getItemAsync(SECURE_STORE_KEYS.WALLETS);
  if (wallets !== null) {
    const walletsParsed = JSON.parse(wallets) as WalletStoredInfo[];
    const walletsParsedExtended = [
      ...walletsParsed,
      { id, address, type, name, net },
    ];
    const toWrite = JSON.stringify(walletsParsedExtended);
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.WALLETS, toWrite);
  } else {
    const toWrite = JSON.stringify([{ id, address, type, name, net }]);
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.WALLETS, toWrite);
  }
};

export const removeWallet = async (id: string) => {
  await SecureStore.deleteItemAsync(id);
  const wallets = await SecureStore.getItemAsync(SECURE_STORE_KEYS.WALLETS);
  if (!wallets) return;
  const walletsParsed = JSON.parse(wallets) as WalletStoredInfo[];
  const walletsFiltered = walletsParsed.filter((v) => v.id !== id);
  const toWrite = JSON.stringify(walletsFiltered);
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.WALLETS, toWrite);
};

export const removeAllWallets = async () => {
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.WALLETS, JSON.stringify([]));
};

export const getWallets = async () => {
  const wallets = await SecureStore.getItemAsync(SECURE_STORE_KEYS.WALLETS);
  if (!wallets) return [];
  return JSON.parse(wallets) as WalletStoredInfo[];
};

export const getWallet = async (id: string) => {
  const wallets = await getWallets();
  const wallet = wallets.find((v) => v.id === id);
  if (!wallet) throw new Error("Stored wallet does not exist");
  return wallet;
};

export const getWalletPrivKey = async (id: string) => {
  const data = await SecureStore.getItemAsync(id);
  if (!data) throw new Error("Stored wallet key does not exist");
  const buffer = Buffer.from(data, "hex");
  return new Uint8Array(buffer);
};

export const getInfoFaucat = async () => {
  const data = await SecureStore.getItemAsync(SECURE_STORE_KEYS.INFO_FAUCAT);
  if (!data) return false;
  return JSON.parse(data) as boolean;
};

export const setInfoFaucat = async (value: boolean) => {
  await SecureStore.setItemAsync(
    SECURE_STORE_KEYS.INFO_FAUCAT,
    JSON.stringify(value)
  );
};
