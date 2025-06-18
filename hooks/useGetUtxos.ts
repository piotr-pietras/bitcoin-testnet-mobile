import { btcApi, GetUtxos } from "@/services/api/btc";
import { getWallet, WalletStoredInfo } from "@/services/storage";
import { UTXO } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useRefetchDebounce } from "./useRefetchDebounce";
import { queryClient } from "@/services/tanstack";

export const useGetUtxos = (id: string, mempool?: boolean, spent?: boolean) => {
  const [wallet, setWallet] = useState<WalletStoredInfo | undefined>(undefined);
  const { refetch, canRefetch, restart } = useRefetchDebounce(6);

  const queryKey = useMemo(() => {
    restart();
    return ["utxos", wallet?.id, `${!!mempool}-${!!spent}`];
  }, [wallet?.id, mempool, spent]);

  useEffect(() => {
    getWallet(id).then((v) => {
      setWallet(v);
    });
  }, [id]);

  return useQuery({
    enabled: !!wallet,
    queryKey,
    staleTime: 6 * 1000,
    queryFn: async () => {
      refetch();
      if (!canRefetch) {
        return (
          queryClient.getQueryData<GetUtxos>(queryKey) ?? {
            data: [],
            total: 0,
          }
        );
      }
      return await btcApi.getUtxos(
        wallet!.address,
        wallet!.net,
        !!mempool,
        !!spent
      );
    },
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
