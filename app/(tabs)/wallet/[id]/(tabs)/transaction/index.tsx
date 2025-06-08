import { Section } from "@/components/Section";
import { UtxoCard } from "@/components/UtxoCard";
import { useGetUtxos } from "@/hooks/useGetUtxos";
import { AccountBTC } from "@/services/btc/AccountBTC";
import { AppTheme, useTheme } from "@/services/theme";
import {
  FlatList,
  RefreshControl,
  TextInput as RNTextInput,
  Switch,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState, useCallback, useMemo, useLayoutEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import Clipboard from "@react-native-clipboard/clipboard";
import Animated, {
  FadeIn,
  LinearTransition,
  useAnimatedKeyboard,
} from "react-native-reanimated";
import { UTXO } from "@/types/global";
import { getWallet, WalletStoredInfo } from "@/services/storage";
import { useValidateTxStates } from "@/hooks/useValidateTxStates";
import { SizeBTC } from "@/services/btc/SizeBTC";
import { useUnmountOnBlur } from "@/hooks/useUnmountOnBlur";

export default function TransactionScreen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const { navigate } = useRouter();
  const keyboard = useAnimatedKeyboard();
  const addressRef = useRef<RNTextInput>(null);
  const [wallet, setWallet] = useState<WalletStoredInfo | null>(null);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [feeRate, setFeeRate] = useState("");
  const [rbf, setRbf] = useState(true);
  const [opReturnData, setOpReturnData] = useState("");
  const [selectedUtxos, setSelectedUtxos] = useState<UTXO[]>([]);

  const [more, setMore] = useState(false);
  const { error, info, transaction } = useValidateTxStates({
    wallet,
    address,
    amount,
    feeRate,
    opReturnData,
    selectedUtxos,
  });

  const params = useGlobalSearchParams<{ id: string }>();
  const { data: utxos, isLoading, refetch } = useGetUtxos(params.id, true, false);
  const spendableUtxos = utxos?.filter(
    (utxo) => !utxo.is_spent && utxo.status === "mined"
  );
  const noUtxos = spendableUtxos?.length === 0 && !isLoading;
  const pendingUtxos = utxos?.filter(
    (utxo) => !utxo.is_spent && utxo.status === "pending"
  );

  const emptyState = !address || !amount || !feeRate || !selectedUtxos.length;
  const hasErrors = !!Object.values(error).length;
  const disabled = noUtxos || emptyState || isLoading || hasErrors;
  const hasAnySpendable =
    !!transaction?.spendable && transaction?.spendable > 0;

  const onSelectUtxo = (utxo: UTXO) => {
    if (selectedUtxos.includes(utxo)) {
      setSelectedUtxos(selectedUtxos.filter((v) => v.tx_id !== utxo.tx_id));
    } else {
      setSelectedUtxos([...selectedUtxos, utxo]);
    }
  };

  const onCreateTransaction = () => {
    navigate({
      pathname: `/wallet/[id]/transaction/submit`,
      params: {
        id: params.id,
        address,
        amount,
        feeRate,
        opReturnData,
        rbf: rbf.toString(),
        utxosIds: selectedUtxos.map((utxo) => utxo.tx_id).join(","),
      },
    });
  };

  useEffect(() => {
    getWallet(params.id).then((wallet) => {
      setWallet(wallet);
    });
  }, [params.id]);

  useEffect(() => {
    setAddress("");
    setAmount("");
    setFeeRate("1");
    setOpReturnData("");
    setSelectedUtxos([]);
  }, [params.id]);

  useFocusEffect(() => {
    const selectedUtxosIds = selectedUtxos.map((utxo) => utxo.tx_id);
    const spendableUtxosIds = spendableUtxos?.map((utxo) => utxo.tx_id);
    const filteredUtxos = selectedUtxosIds.filter((id) =>
      spendableUtxosIds?.includes(id)
    );
    if (filteredUtxos.length !== selectedUtxos.length) {
      setSelectedUtxos([]);
    }
  });

  return (
    <ScrollView
      refreshControl={
        <RefreshControl onRefresh={() => refetch()} refreshing={isLoading} />
      }
    >
      <View style={styles.container}>
        <Section text="Fill transaction">
          <TextInput
            ref={addressRef}
            value={address}
            right={
              <TextInput.Icon
                icon="clipboard"
                onPress={() =>
                  Clipboard.getString().then((text) => {
                    if (text) setAddress(text);
                  })
                }
              />
            }
            mode="outlined"
            onChangeText={(v) => setAddress(v)}
            label={"Address"}
          />
          {error.has("address") && (
            <Text variant="labelMedium" style={styles.error}>
              {error.get("address")}
            </Text>
          )}
          {/* ---------------------------- */}
          <TextInput
            mode="outlined"
            value={amount}
            right={
              <TextInput.Affix
                text={`${
                  Number(amount) / Math.pow(10, AccountBTC.decimals)
                } btc`}
              />
            }
            keyboardType="decimal-pad"
            maxLength={14}
            onChangeText={(v) => setAmount(v)}
            label={"Amount (satoshi)"}
          />
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text variant="labelMedium">{info.get("spendable")}</Text>
            {hasAnySpendable && (
              <TouchableOpacity
                onPress={() => {
                  if (!wallet?.type) return;
                  const all = SizeBTC.calcSendAllAmount(
                    wallet?.type,
                    selectedUtxos,
                    Number(feeRate),
                    opReturnData
                  );
                  setAmount(all.toString());
                }}
              >
                <Text
                  variant="labelMedium"
                  style={{ color: theme.colors.primary }}
                >
                  Send all
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {info.get("amount") && (
            <View style={styles.info}>
              <Text
                variant="labelMedium"
                style={[styles.infoText, styles.textCenter]}
              >
                {info.get("amount")}
              </Text>
            </View>
          )}
          {error.has("amount") && (
            <Text variant="labelMedium" style={styles.error}>
              {error.get("amount")}
            </Text>
          )}
          {/* ---------------------------- */}
          <TextInput
            mode="outlined"
            value={feeRate}
            keyboardType="decimal-pad"
            maxLength={8}
            onChangeText={(v) => setFeeRate(v)}
            label={"Fee rate (sats/vB)"}
          />
          <Text variant="labelMedium">{info.get("fee")}</Text>
          {error.has("feeRate") && (
            <Text variant="labelMedium" style={styles.error}>
              {error.get("feeRate")}
            </Text>
          )}
          <Text variant="labelSmall" style={styles.label}>
            1 sats/vB is usually enough for testnet to include tx into first
            block
          </Text>
          {/* ---------------------------- */}
          {more && (
            <Animated.View
              entering={FadeIn}
              style={{
                gap: theme.sizes.s,
              }}
            >
              <Text variant="titleMedium" style={styles.title}>
                Optional
              </Text>
              <View style={{ alignItems: "center", flexDirection: "row" }}>
                <Text variant="labelLarge">Replace by fee</Text>
                <Switch value={rbf} onValueChange={(e) => setRbf(e)} />
              </View>
              {/* ---------------------------- */}
              <TextInput
                mode="outlined"
                value={opReturnData}
                keyboardType="decimal-pad"
                onChangeText={(v) => setOpReturnData(v)}
                label={"OP_RETURN data"}
              />
              <Text variant="labelSmall" style={styles.label}>
                80 bytes of data that will be stored in the chain as unspendable
                transaction
              </Text>
              {error.has("opReturnData") && (
                <Text variant="labelMedium" style={styles.error}>
                  {error.get("opReturnData")}
                </Text>
              )}
            </Animated.View>
          )}
          <View style={{ alignItems: "flex-end" }}>
            <Button onPress={() => setMore(!more)}>
              {more ? "Less" : "More"}
            </Button>
          </View>
        </Section>
        {/* ---------------------------- */}
        <Section text="Select UTXOs">
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View>
              <Animated.FlatList
                ListHeaderComponent={() => (
                  <View>
                    <Text variant="labelMedium">{info.get("utxos")}</Text>
                    <Text variant="labelMedium">{info.get("size")}</Text>
                    <Text variant="labelMedium">{info.get("fee")}</Text>
                    <Text variant="labelMedium">{info.get("spendable")}</Text>
                    <Text variant="labelMedium">{info.get("exchange")}</Text>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <Text variant="bodyMedium" style={[styles.label, styles.textCenter]}>
                    No mined UTXOs to spent
                  </Text>
                )}
                data={spendableUtxos}
                columnWrapperStyle={{ gap: theme.sizes.m }}
                contentContainerStyle={{ gap: theme.sizes.m }}
                keyExtractor={(item) => item.tx_id}
                numColumns={2}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <UtxoCard
                    key={item.tx_id}
                    utxo={item}
                    small
                    selected={selectedUtxos.includes(item)}
                    hideSpent
                    onPress={() => onSelectUtxo(item)}
                  />
                )}
              />
              {/* ---------------------------- */}
              {!!pendingUtxos?.length && <View style={styles.separator} />}
              <Animated.FlatList
                data={pendingUtxos}
                columnWrapperStyle={{ gap: theme.sizes.m }}
                contentContainerStyle={{ gap: theme.sizes.m }}
                keyExtractor={(item) => item.tx_id}
                numColumns={2}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <UtxoCard key={item.tx_id} utxo={item} small hideSpent />
                )}
              />
            </View>
          )}
        </Section>
        <Button
          disabled={disabled}
          onPress={onCreateTransaction}
          mode="contained-tonal"
        >
          Create and sign transaction
        </Button>
      </View>

      <Animated.View style={{ height: keyboard.height }} />
    </ScrollView>
  );
}

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.sizes.m,
      gap: theme.sizes.m,
    },
    error: {
      color: theme.colors.error,
    },
    title: {
      color: theme.colors.onSurfaceVariant,
      marginVertical: theme.sizes.s,
    },
    label: {
      color: theme.colors.onSurfaceVariant,
    },
    textCenter: {
      textAlign: "center",
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.backdrop,
      marginVertical: theme.sizes.m,
    },
    info: {
      backgroundColor: theme.colors.warning,
      opacity: 0.8,
      padding: theme.sizes.s,
      borderRadius: theme.sizes.s,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.outline,
    },
    infoText: {
      color: theme.colors.onTertiaryContainer,
    },
  });
