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
import Animated, { FadeIn } from "react-native-reanimated";

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
          {filteredUtxos?.map((utxo, i) => (
            <Animated.View key={utxo.tx_id} entering={FadeIn.delay(50 * i)}>
              <UtxoCard
                utxo={utxo}
                onPress={() => {
                  getWallet(params.id).then((wallet) => {
                    push(
                      `/wallet/${params.id}/utxos/${utxo.tx_id}?net=${wallet.net}`
                    );
                  });
                }}
              />
            </Animated.View>
          ))}
          {filteredUtxos?.length === 0 && (
            <View>
              <Text
                variant="labelMedium"
                style={[styles.label, styles.textCenter]}
              >
                No UTXOs found.
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
