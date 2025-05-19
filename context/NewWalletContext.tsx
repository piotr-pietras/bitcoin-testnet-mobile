import { sha256 } from "@noble/hashes/sha256";
import { useRouter } from "expo-router";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { AccountBTC } from "@/services/AccountBTC";
import { saveWallet } from "@/services/storage";
import { Net } from "@/types/global";

type ContextValues =
  | {
      startNewWallet: () => void;
      generateNewWallet: () => void;
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
    }
  | undefined;

const Context = createContext<ContextValues>(undefined);

export const NewWalletContext = (props: PropsWithChildren) => {
  const [step, setStep] = useState(1);
  const { replace } = useRouter();
  const [net, setNet] = useState<Net>("TEST");
  const [type, setType] = useState<"p2pkh" | "p2wpkh">("p2pkh");
  const [phrase, setPhrase] = useState("");
  const [name, setName] = useState("");

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
    const privKey = sha256(phrase);
    const account = new AccountBTC(privKey, net, type);
    saveWallet(privKey, account.address, type, net, name);
  };

  const allowGenerate = !!phrase;

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
        net,
        setNet,
        setType,
        name,
        setName,
        phrase,
        setPhrase,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export const useNewWalletContext = () => {
  return useContext(Context);
};
