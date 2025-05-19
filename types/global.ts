export type Blockchain = "BTC" | "ETH";

export type AddressType = "p2pkh" | "p2wpkh";

export type Net = "TEST" | "TEST4";

export const NetNamePath: { [keys in Net]: string } = {
  TEST: "testnet",
  TEST4: "testnet4",
} as const;

export type UTXO = {
  tx_id: string;
  index: number;
  value: number;
  confirmations: number;
  status: "mined" | "spent" | "pending";
  script?: string;
};
