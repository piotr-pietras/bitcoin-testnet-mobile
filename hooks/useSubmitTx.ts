import { queryClient } from "@/services/tanstack";
import { TransactionBTC } from "@/services/TransactionBTC";
import { useMutation } from "@tanstack/react-query";

export const useSubmitTx = (
  transaction: TransactionBTC | null,
  onError?: (error: Error) => void
) => {
  return useMutation({
    mutationFn: async () => await transaction?.send(),
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utxos"] });
    },
  });
};
