import { ActivityIndicator, Chip, Text } from "react-native-paper";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { UTXO } from "@/types/global";
import { AppTheme, useTheme } from "@/services/theme";
import { AccountBTC } from "@/services/btc/AccountBTC";
import { Ionicons } from "@expo/vector-icons";
import Card from "./Card";

type Props = {
  utxo: UTXO;
  small?: boolean;
  selected?: boolean;
  hideSpent?: boolean;
  onPress?: (txId: string) => void;
};

export const UtxoCard = ({
  utxo,
  small,
  selected,
  hideSpent,
  onPress,
}: Props) => {
  const theme = useTheme();
  const styles = stylesBuilder(theme);

  return (
    <Card
      onPress={() => onPress?.(utxo.tx_id)}
      style={[
        styles.container,
        selected ? styles.selectedContainer : styles.unselectedContainer,
      ]}
    >
      <View style={styles.chipContainer}>
        <View style={styles.chipContainerRight}>
          {utxo.status === "pending" && (
            <ActivityIndicator size={theme.sizes.m} />
          )}
          <Chip
            style={{
              backgroundColor:
                utxo.status === "mined"
                  ? theme.colors.success
                  : theme.colors.warning,
            }}
          >
            {utxo.status}
          </Chip>
          {!hideSpent && (
            <Chip
              style={{
                backgroundColor: utxo.is_spent
                  ? theme.colors.error
                  : theme.colors.success,
              }}
            >
              {utxo.is_spent ? "spent" : "unspent"}
            </Chip>
          )}
        </View>
        {selected === true && (
          <Ionicons
            name="checkbox"
            color={theme.colors.success}
            size={theme.sizes.l}
          />
        )}
        {selected === false && (
          <Ionicons
            name="square-outline"
            color={theme.colors.backdrop}
            size={theme.sizes.l}
          />
        )}
      </View>
      <View style={styles.section}>
        {!small && (
          <Text style={styles.label} variant="bodyMedium" numberOfLines={1}>
            TX id
          </Text>
        )}
        <Text style={{ flexShrink: 1 }} variant="bodyMedium" numberOfLines={1}>
          {utxo.tx_id}
        </Text>
      </View>
      <View style={styles.section}>
        {!small && (
          <View>
            <Text style={styles.label} variant="bodyMedium" numberOfLines={1}>
              Value:
            </Text>
            <Text
              style={{ flexShrink: 1 }}
              variant="bodyMedium"
              numberOfLines={1}
            >
              {`${utxo.value} satoshi`}
            </Text>
          </View>
        )}
        <Text style={styles.label} variant="bodyMedium" numberOfLines={1}>
          {`${utxo.value / Math.pow(10, AccountBTC.decimals)} btc`}
        </Text>
      </View>
      {!small && (
        <View style={styles.section}>
          <Text style={styles.label} variant="bodyMedium" numberOfLines={1}>
            Confirmations
          </Text>
          <Text
            style={{ flexShrink: 1 }}
            variant="bodyMedium"
            numberOfLines={1}
          >
            {utxo.confirmations}
          </Text>
        </View>
      )}
    </Card>
  );
};

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.sizes.m,
      backgroundColor: theme.colors.surface,
    },
    selectedContainer: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.success,
    },
    unselectedContainer: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.backdrop,
    },
    chipContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.sizes.m,
    },
    chipContainerRight: {
      flexDirection: "row",
      gap: theme.sizes.s,
    },
    section: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.sizes.s,
    },
    label: {
      color: theme.colors.onSurfaceVariant,
    },
  });
