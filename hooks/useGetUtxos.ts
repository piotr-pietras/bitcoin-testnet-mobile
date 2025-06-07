import { btcApi, GetUtxos } from "@/services/api/btc";
import { getWallet, WalletStoredInfo } from "@/services/storage";
import { UTXO } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useGetUtxos = (id: string, mempool?: boolean) => {
  const [wallet, setWallet] = useState<WalletStoredInfo | undefined>(undefined);

  useEffect(() => {
    getWallet(id).then((v) => {
      setWallet(v);
    });
  }, [id]);

  return useQuery({
    enabled: !!wallet,
    queryKey: ["utxos", wallet?.id, (!!mempool).toString()],
    staleTime: 10000,
    queryFn: async () =>
      await btcApi.getUtxos(wallet!.address, wallet!.net, !!mempool),
    select,
  });
};

const select = (data: GetUtxos) => {
  const utxos: UTXO[] = data.data.map(
    ({ value, is_spent, status, ...data }) => {
      return {
        index: data[status]!.index,
        value,
        status,
        is_spent,
        tx_id: data[status]!.tx_id,
        confirmations: data[status]!.confirmations,
        script: data[status]!.meta.script,
      };
    }
  );
  return utxos;
};
