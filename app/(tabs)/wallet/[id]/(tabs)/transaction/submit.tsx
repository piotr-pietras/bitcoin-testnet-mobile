import { useGetUtxos } from "@/hooks/useGetUtxos";
import { AccountBTC } from "@/services/AccountBTC";
import { getWallet, getWalletPrivKey } from "@/services/storage";
import { AppTheme, useTheme } from "@/services/theme";
import { UTXO } from "@/types/global";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { useSubmitTx } from "@/hooks/useSubmitTx";
import { AxiosError } from "axios";
import { TransactionBTC } from "@/services/TransactionBTC";

export default function SubmitScreen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const [isInit, setIsInit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { navigate } = useRouter();

  const [transaction, setTransaction] = useState<TransactionBTC | null>(null);
  const {
    mutate,
    isPending,
    data: txId,
  } = useSubmitTx(transaction, (e) => {
    if (e instanceof AxiosError) {
      setError(e.response?.data.detail);
    } else {
      setError((error as Object).toString());
    }
  });

  const params = useGlobalSearchParams<{
    id: string;
    address: string;
    amount: string;
    feeRate: string;
  }>();
  const { data, isSuccess, status } = useGetUtxos(params.id);

  useEffect(() => {
    const init = async (utxos: UTXO[]) => {
      try {
        const wallet = await getWallet(params.id);
        const privKey = await getWalletPrivKey(params.id);
        if (!wallet.type)
          throw new Error("Wallet type has not been retrieved from cache");

        const account = new AccountBTC(privKey, "TEST", wallet.type);
        const transaction = new TransactionBTC(account, utxos);
        await transaction.create(
          params.address,
          Number(params.amount),
          Number(params.feeRate)
        );
        await transaction.sign();

        setTransaction(transaction);
        setIsInit(true);
      } catch (error) {
        setError((error as Object).toString());
        setIsInit(true);
      }
    };

    if (isSuccess && !txId) {
      init(data);
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
        <Text variant="bodyLarge" style={styles.error}>{`${error}`}</Text>
      </Card>
    );

  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.container}>
            <Text variant="bodyMedium">{`Address: ${transaction?.address}`}</Text>
            <Text variant="bodyMedium">{`Value: ${transaction?.value} (${
              transaction?.value! / Math.pow(10, AccountBTC.decimals)
            } btc)`}</Text>
            <Text variant="bodyMedium">{`Fee: ${transaction?.fee} (${
              transaction?.fee! / Math.pow(10, AccountBTC.decimals)
            } btc)`}</Text>
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
                onPress={() => {
                  navigate(`/(tabs)/wallet/[id]/(tabs)/transaction/${txId}`);
                }}
              >
                <Card style={styles.successContainer}>
                  <Text
                    variant="bodyLarge"
                    style={styles.success}
                  >{`${txId} \n(tap to get more info)`}</Text>
                </Card>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </>
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
  });
