import { Net } from "@/types/global";
import { nativeBtcApiClient, universalBtcApiClient } from "./axios";

export type GetUtxos = {
  data: {
    is_spent: boolean;
    value: number;
    status: "mined" | "spent" | "pending";
    mined?: {
      tx_id: string;
      block_id: string;
      block_number: number;
      confirmations: number;
      date: number;
      index: number;
      meta: { script_type: string; script?: string };
    };
    pending?: {
      tx_id: string;
      block_id: string;
      block_number: number;
      confirmations: number;
      date: number;
      index: number;
      meta: { script_type: string; script?: string };
    };
    spent?: {
      tx_id: string;
      block_id: string;
      block_number: number;
      confirmations: number;
      date: number;
      index: number;
      meta: { script_type: string; script?: string };
    };
  }[];
  total: number;
};

export const btcApi = {
  async getUtxos(address: string, all?: boolean): Promise<GetUtxos> {
    const client = await universalBtcApiClient();
    const res = await client.get(
      `/account/${address}/utxo${all ? "?check_mempool=true" : ""}`
    );
    return res.data;
  },

  async getRawTx(txId: string): Promise<{ result: string }> {
    const client = await nativeBtcApiClient();
    const res = await client.post("/", {
      jsonrpc: "2.0",
      id: 1,
      method: "getrawtransaction",
      params: [txId],
    });
    return res.data;
  },

  async submitSignedTx(tx: string): Promise<{ id: string }> {
    const client = await universalBtcApiClient();
    const payload = JSON.stringify({ tx });
    const res = await client.post("/tx/send", payload);
    return res.data;
  },
} as const;
