import { RegtestBTC } from "@/services/btc/RegtestBTC";
import { REGTEST_CHECK_CONNECTION_INTERVAL } from "@/types/global";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type ContextValues =
  | {
      connect: (
        rpcUrl: string,
        rpcUser: string,
        rpcPassword: string
      ) => Promise<void>;
      isConnected: boolean;
      disconnect: () => void;
    }
  | undefined;

const Context = createContext<ContextValues>(undefined);

export const RegtestContext = (props: PropsWithChildren) => {
  const [regtestBTC, setRegtestBTC] = useState<RegtestBTC | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = async (
    rpcUrl: string,
    rpcUser: string,
    rpcPassword: string
  ) => {
    try {
      const regtestBTC = await new RegtestBTC().connect(
        rpcUrl,
        rpcUser,
        rpcPassword
      );
      setRegtestBTC(regtestBTC);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    setRegtestBTC(null);
    setIsConnected(false);
  };

  useEffect(() => {
    let interval: number;

    if (isConnected) {
      interval = setInterval(async () => {
        try {
          await regtestBTC?.getBlockchainInfo();
          console.log("Regtest connection is still alive");
        } catch (error) {
          console.log("Regtest connection lost");
          disconnect();
        }
      }, REGTEST_CHECK_CONNECTION_INTERVAL);
    }

    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <Context.Provider
      value={{
        connect,
        isConnected,
        disconnect,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export const useRegtestContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useRegtestContext must be used within a RegtestContext");
  }

  return context;
};
