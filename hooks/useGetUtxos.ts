import { btcApi, GetUtxos } from "@/services/api/btc";
import { getWallet, WalletStoredInfo } from "@/services/storage";
import { UTXO } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useGetUtxos = (id: string, all?: boolean) => {
  const [wallet, setWallet] = useState<WalletStoredInfo | undefined>(undefined);

  useEffect(() => {
    getWallet(id).then((v) => {
      setWallet(v);
    });
  }, []);

  return useQuery({
    enabled: !!wallet,
    queryKey: ["utxos", id],
    staleTime: 10000,
    queryFn: async () => await btcApi.getUtxos(wallet!.address, all),
    select,
  });
};

const select = (data: GetUtxos) => {
  const utxos: UTXO[] = data.data
    .filter(({ is_spent, status }) => is_spent === false && status === "mined")
    .map(({ value, status, ...data }) => {
      return {
        index: data[status]!.index,
        value,
        status,
        tx_id: data[status]!.tx_id,
        confirmations: data[status]!.confirmations,
        script: data[status]!.meta.script,
      };
    });
  return utxos;
};
