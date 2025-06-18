import { queryClient } from "@/services/tanstack";
import { TransactionBTC } from "@/services/btc/TransactionBTC";
import { useMutation } from "@tanstack/react-query";
import { BLOCK_DAEMON_REFETCH_INTERVAL } from "@/types/global";

export const useSubmitTx = (
  walletId: string,
  transaction: TransactionBTC | null,
  onError?: (error: Error) => void
) => {
  return useMutation({
    mutationFn: async () => await transaction?.send(),
    onError,
    onSuccess: () => {
      setTimeout(async () => {
        await queryClient.refetchQueries({ queryKey: ["utxos", walletId, "true-false"] });
      }, BLOCK_DAEMON_REFETCH_INTERVAL);
    },
  });
};
