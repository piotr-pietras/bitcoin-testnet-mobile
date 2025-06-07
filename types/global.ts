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
  is_spent: boolean;
  script?: string;
};

export const Faucats: { [keys in Net]: { [keys in string]: string } } = {
  TEST4: {
    "faucet.testnet4.dev": "https://faucet.testnet4.dev/",
    "coinfaucet.eu": "https://coinfaucet.eu/en/btc-testnet4/",
  },
  TEST: {
    "coinfaucet.eu": "https://coinfaucet.eu/en/btc-testnet/",
    // "faucet.triangleplatform.com":
    //   "https://faucet.triangleplatform.com/bitcoin/testnet",
    // "tbtc.bitaps.com": "https://tbtc.bitaps.com/",
  },
} as const;
