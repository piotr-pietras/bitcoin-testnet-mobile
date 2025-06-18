import { sha256 } from "@noble/hashes/sha2.js";
import { useRouter } from "expo-router";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { AccountBTC } from "@/services/btc/AccountBTC";
import { saveWallet } from "@/services/storage";
import { Net } from "@/types/global";
import { hexToUint8Array } from "@/services/uint8Array";

type ContextValues =
  | {
      startNewWallet: () => void;
      generateNewWallet: () => Promise<void>;
      nextStep: () => void;
      previousStep: () => void;
      step: number;
      allowGenerate: boolean;
      net: Net;
      setNet: Dispatch<SetStateAction<Net>>;
      type: "p2pkh" | "p2wpkh";
      setType: Dispatch<SetStateAction<"p2pkh" | "p2wpkh">>;
      name: string;
      setName: Dispatch<SetStateAction<string>>;
      phrase: string;
      setPhrase: Dispatch<SetStateAction<string>>;
      privetKey: string;
      setPrivetKey: Dispatch<SetStateAction<string>>;
      seedType: "keywords" | "privetKey";
      setSeedType: Dispatch<SetStateAction<"keywords" | "privetKey">>;
    }
  | undefined;

const Context = createContext<ContextValues>(undefined);

export const NewWalletContext = (props: PropsWithChildren) => {
  const [step, setStep] = useState(1);
  const { replace } = useRouter();
  const [net, setNet] = useState<Net>("TEST");
  const [type, setType] = useState<"p2pkh" | "p2wpkh">("p2wpkh");
  const [phrase, setPhrase] = useState("");
  const [privetKey, setPrivetKey] = useState("");
  const [name, setName] = useState("");
  const [seedType, setSeedType] = useState<"keywords" | "privetKey">(
    "keywords"
  );

  const nextStep = () => {
    replace(`/new-wallet/step${step + 1}` as any);
    setStep(step + 1);
  };
  const previousStep = () => {
    replace(`/new-wallet/step${step - 1}` as any);
    setStep(step - 1);
  };
  const startNewWallet = () => {
    setStep(1);
    setPhrase("");
    setName("");
  };
  const generateNewWallet = () => {
    let privKey;
    if (seedType === "keywords") {
      privKey = sha256(phrase);
    } else {
      privKey = hexToUint8Array(privetKey);
    }
    const account = new AccountBTC(privKey, net, type);
    return saveWallet(privKey, account.address, type, net, name);
  };

  const allowGenerateKeywords = !!phrase || !(seedType === "keywords");
  const allowGeneratePrivetKey =
    !!privetKey.match(/^[0-9a-fA-F]{64}$/) || !(seedType === "privetKey");
  const allowGenerate = allowGenerateKeywords && allowGeneratePrivetKey;

  return (
    <Context.Provider
      value={{
        startNewWallet,
        generateNewWallet,
        nextStep,
        previousStep,
        step,
        allowGenerate,
        type,
        setType,
        net,
        setNet,
        name,
        setName,
        phrase,
        setPhrase,
        privetKey,
        setPrivetKey,
        seedType,
        setSeedType,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export const useNewWalletContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      "useNewWalletContext must be used within a NewWalletContext"
    );
  }

  return context;
};
