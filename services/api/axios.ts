import { Net, NetNamePath } from "@/types/global";
import axios from "axios";

export const universalBtcApiClient = async (net: Net) => {
  const token =  process.env.EXPO_PUBLIC_BLOCKDAEMON_API_KEY;
  const netNamePath = NetNamePath[net];
  return axios.create({
    baseURL: `https://svc.blockdaemon.com/universal/v1/bitcoin/${netNamePath}`,
    headers: {
      "X-API-Key": token,
    },
  });
};

export const nativeBtcApiClient = async (net: Net) => {
  const token =  process.env.EXPO_PUBLIC_BLOCKDAEMON_API_KEY;
  const netNamePath = NetNamePath[net];
  return axios.create({
    baseURL: `https://svc.blockdaemon.com/bitcoin/${netNamePath}/native`,
    headers: {
      "X-API-Key": token,
    },
  });
};