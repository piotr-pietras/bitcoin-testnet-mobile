import { UtxoCard } from "@/components/UtxoCard";
import { useGetUtxos } from "@/hooks/useGetUtxos";
import { AppTheme, useTheme } from "@/services/theme";
import { useGlobalSearchParams } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function UtxosScreen() {
  const theme = useTheme();
  const params = useGlobalSearchParams<{ id: string }>();
  const styles = stylesBuilder(theme);
  const { data, isLoading, refetch } = useGetUtxos(params.id, true);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={() => refetch()} refreshing={isLoading} />
        }
      >
        <View style={styles.contentContainer}>
          {data?.map((utxo) => (
            <UtxoCard key={utxo.tx_id} utxo={utxo} />
          ))}
          {data?.length === 0 && (
            <>
              <Text style={styles.label}>
                It seems like you don't have any utxos to spent.
              </Text>
              <Text style={styles.label}>
                If you recently send a transaction probably your utxo is in
                mempool waiting to be included into a block.
              </Text>
              <Text style={styles.label}>
                If you don't have any coins visit a faucat to receive some.
              </Text>
            </>
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
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    label: {
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.sizes.s,
    },
  });
