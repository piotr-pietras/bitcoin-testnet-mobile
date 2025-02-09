export type Blockchain = "BTC" | "ETH";

export type AddressType = "p2pkh" | "p2wpkh";

export type Net = "MAIN" | "TEST";

export const NetName: { [keys in Blockchain]: { [keys in Net]: string } } = {
  BTC: { MAIN: "mainnet", TEST: "testnet" },
  ETH: { MAIN: "mainnet", TEST: "sepolia" },
} as const;

export type UTXO = {
  tx_id: string;
  index: number;
  value: number;
  confirmations: number;
  status: "mined" | "spent" | "pending";
  script?: string;
};
