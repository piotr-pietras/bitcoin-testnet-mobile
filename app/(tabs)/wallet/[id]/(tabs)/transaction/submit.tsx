import { useGetUtxos } from "@/hooks/useGetUtxos";
import { AccountBTC } from "@/services/btc/AccountBTC";
import { getWallet, getWalletPrivKey } from "@/services/storage";
import { AppTheme, useTheme } from "@/services/theme";
import { Net, UTXO } from "@/types/global";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { useSubmitTx } from "@/hooks/useSubmitTx";
import { AxiosError } from "axios";
import { TransactionBTC } from "@/services/btc/TransactionBTC";

export default function SubmitScreen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const [net, setNet] = useState<Net | null>(null);
  const [isInit, setIsInit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { navigate } = useRouter();
  const params = useGlobalSearchParams<{
    id: string;
    address: string;
    amount: string;
    feeRate: string;
    rbf: string;
    opReturnData: string;
    utxosIds: string;
  }>();

  const [transaction, setTransaction] = useState<TransactionBTC | null>(null);
  const {
    mutate,
    isPending,
    data: txId,
  } = useSubmitTx(params.id, transaction, (e) => {
    if (e instanceof AxiosError) {
      setError(e.response?.data.detail);
    } else {
      setError((error as Object).toString());
    }
  });

  const { data, isSuccess, status } = useGetUtxos(params.id, true, false);

  useEffect(() => {
    const init = async (utxos: UTXO[]) => {
      try {
        const wallet = await getWallet(params.id);
        const privKey = await getWalletPrivKey(params.id);
        if (!wallet.type)
          throw new Error("Wallet type has not been retrieved from cache");

        const account = new AccountBTC(privKey, wallet.net, wallet.type);
        const transaction = new TransactionBTC(account, utxos);
        await transaction.create(
          params.address,
          Number(params.amount),
          Number(params.feeRate),
          { rbf: params.rbf === "true", opReturnData: params.opReturnData }
        );
        await transaction.sign();

        setNet(wallet.net);
        setTransaction(transaction);
        setIsInit(true);
      } catch (error) {
        setError((error as Object).toString());
        setIsInit(true);
      }
    };

    if (isSuccess && !txId && !error) {
      init(data.filter((v) => params.utxosIds?.includes(v.tx_id)));
    }
  }, [data, isSuccess, status]);

  if (!isInit)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  if (error)
    return (
      <Card style={styles.errorContainer}>
        <Text variant="bodyLarge" style={styles.error}>
          🚨 Error
        </Text>
        <Text variant="labelLarge" style={styles.error}>
          {`${error}`}
        </Text>
      </Card>
    );

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Text variant="bodyLarge">📪 Recipient Address</Text>
          <Text style={styles.textParagraph} variant="bodyMedium">
            {transaction?.address}
          </Text>
        </View>
        <View>
          <Text variant="bodyLarge">🪙 Sent Value</Text>
          <Text style={styles.textParagraph} variant="bodyMedium">
            {transaction?.value} satoshi (
            {transaction?.value! / Math.pow(10, AccountBTC.decimals)} btc)
          </Text>
        </View>
        <View>
          <Text variant="bodyLarge">👀 Spent Fee</Text>
          <Text style={styles.textParagraph} variant="bodyMedium">
            {transaction?.fee} satoshi (
            {transaction?.fee! / Math.pow(10, AccountBTC.decimals)} btc)
          </Text>
        </View>
        <View>
          <Text variant="bodyLarge">🎨 Used UTXOs</Text>
          <View style={styles.utxoContainer}>
            {transaction?.utxos.map((v) => (
              <View key={v.tx_id} style={styles.utxoItem}>
                <Text variant="labelMedium">{v.tx_id.slice(0, 10)}...</Text>
              </View>
            ))}
          </View>
        </View>
        {!transaction?.info.get("EXCHANGE_IS_DUST") && <View>
          <Text variant="bodyLarge">↩ Returned Exchange</Text>
          <Text style={styles.textParagraph} variant="bodyMedium">
            {transaction?.exchange} satoshi
          </Text>
        </View>}
        {!txId ? (
          <Button
            loading={isPending}
            disabled={isPending}
            onPress={() => mutate()}
            mode="contained-tonal"
          >
            Submit transaction
          </Button>
        ) : (
          <TouchableOpacity
            onPress={() =>
              navigate({
                pathname: "/(tabs)/wallet/[id]/(tabs)/transaction/[txId]",
                params: {
                  id: params.id,
                  txId,
                  net,
                },
              })
            }
          >
            <Card style={styles.successContainer}>
              <Text variant="titleMedium" style={styles.success}>
                🚀 Transaction submitted!
              </Text>
              <Text variant="labelSmall" style={styles.success}>
                {txId}
              </Text>
              <Text variant="labelLarge" style={styles.success}>
                (tap to get more info)
              </Text>
            </Card>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.sizes.m,
      margin: theme.sizes.m,
      gap: theme.sizes.m,
    },
    error: {
      color: theme.colors.onErrorContainer,
      textAlign: "center",
    },
    errorContainer: {
      backgroundColor: theme.colors.errorContainer,
      padding: theme.sizes.m,
      margin: theme.sizes.m,
    },
    success: {
      color: theme.colors.onSecondaryContainer,
      textAlign: "center",
    },
    successContainer: {
      backgroundColor: theme.colors.success,
      padding: theme.sizes.m,
      margin: theme.sizes.m,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
    },
    textParagraph: {
      marginLeft: theme.sizes.m,
    },
    utxoContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.sizes.s,
      marginTop: theme.sizes.s,
    },
    utxoItem: {
      padding: theme.sizes.s,
      backgroundColor: theme.colors.backdrop,
      borderRadius: theme.sizes.s,
    },
  });
