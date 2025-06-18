import axios, { AxiosInstance } from "axios";

type BlockchainInfo = {
  chain: string;
  blocks: number;
  bestblockhash: string;
  difficulty: number;
};

export class RegtestBTC {
  private rpcClient: AxiosInstance = axios.create({});
  private info: BlockchainInfo | null = null;

  async connect(rpcUrl: string, rpcUser: string, rpcPassword: string) {
    this.rpcClient = axios.create({
      timeout: 4000,
      baseURL: rpcUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${rpcUser}:${rpcPassword}`
        ).toString("base64")}`,
      },
    });

    try {
      const response = await this.rpcClient.post("/", {
        jsonrpc: "2.0",
        method: "getblockchaininfo",
        params: [],
      });
      this.info = response.data;
    } catch (error) {
      throw error;
    }

    return this;
  }

  async getBlockchainInfo() {
    try {
      const response = await this.rpcClient.post("/", {
        jsonrpc: "2.0",
        method: "getblockchaininfo",
        params: [],
      });

      this.info = response.data;
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
