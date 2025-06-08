import { UtxoCard } from "@/components/UtxoCard";
import { useGetUtxos } from "@/hooks/useGetUtxos";
import { getWallet } from "@/services/storage";
import { AppTheme, useTheme } from "@/services/theme";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { Text } from "react-native-paper";

export default function UtxosScreen() {
  const theme = useTheme();
  const { push } = useRouter();
  const params = useGlobalSearchParams<{ id: string }>();
  const styles = stylesBuilder(theme);
  const [showSpent, setShowSpent] = useState(false);
  const { data, isLoading, refetch } = useGetUtxos(params.id, true, showSpent);

  const filteredUtxos = data?.filter((utxo) => {
    if (showSpent) return true;
    return !utxo.is_spent;
  });

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text>Show spent</Text>
        <Switch
          value={showSpent}
          onValueChange={() => setShowSpent(!showSpent)}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={() => refetch()} refreshing={isLoading} />
        }
      >
        <View style={styles.contentContainer}>
          {filteredUtxos?.map((utxo) => (
            <UtxoCard
              key={utxo.tx_id}
              utxo={utxo}
              onPress={() => {
                getWallet(params.id).then((wallet) => {
                  push(`/wallet/${params.id}/utxos/${utxo.tx_id}?net=${wallet.net}`);
                });
              }}
            />
          ))}
          {filteredUtxos?.length === 0 && (
            <View>
              <Text variant="labelMedium" style={[styles.label, styles.textCenter]}>
                It seems like you don't have any UTXOs to spent.
              </Text>
              <Text variant="labelMedium" style={[styles.label, styles.textCenter]}>
                If you recently send a transaction probably your UTXO is in
                mempool waiting to be included into a block.
              </Text>
              <Text variant="labelMedium" style={[styles.label, styles.textCenter]}>
                If you don't have any coins visit a faucat to receive some.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
      padding: theme.sizes.m,
      gap: theme.sizes.m,
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: theme.sizes.s,
      marginTop: theme.sizes.m,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    label: {
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.sizes.s,
    },
    textCenter: {
      textAlign: "center",
    },
  });
