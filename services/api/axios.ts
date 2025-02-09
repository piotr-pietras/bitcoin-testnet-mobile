import axios from "axios";

export const universalBtcApiClient = async () => {
  const token =  process.env.EXPO_PUBLIC_BLOCKDAEMON_API_KEY;
  return axios.create({
    baseURL: `https://svc.blockdaemon.com/universal/v1/bitcoin/testnet`,
    headers: {
      "X-API-Key": token,
    },
  });
};

export const nativeBtcApiClient = async () => {
  const token =  process.env.EXPO_PUBLIC_BLOCKDAEMON_API_KEY;
  return axios.create({
    baseURL: `https://svc.blockdaemon.com/bitcoin/testnet/native`,
    headers: {
      "X-API-Key": token,
    },
  });
};