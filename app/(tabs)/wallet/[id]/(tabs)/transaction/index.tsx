import { Section } from "@/components/Section";
import { UtxoCard } from "@/components/UtxoCard";
import { useGetUtxos } from "@/hooks/useGetUtxos";
import { AccountBTC } from "@/services/AccountBTC";
import { AppTheme, useTheme } from "@/services/theme";
import { TextInput as RNTextInput, Switch } from "react-native";
import { validate as addressValidate } from "bitcoin-address-validation";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import validator from "validator";
import Clipboard from "@react-native-clipboard/clipboard";
import Animated, { useAnimatedKeyboard } from "react-native-reanimated";

type States = {
  address?: string;
  amount?: string;
  feeRate?: string;
  opReturnData?: string;
};

const validateStates = (states: States) => {
  let errors: { [keys in keyof typeof states]?: string | undefined } = {};

  if (states.address) {
    if (!addressValidate(states.address)) {
      errors = { ...errors, address: "Invalid bitcoin address" };
    }
  }
  if (states.amount) {
    if (Number(states.amount) < 148) {
      errors = {
        ...errors,
        feeRate: "Amount lesser than 148 may be considered as dust",
      };
    }
    if (!validator.isInt(states.amount)) {
      errors = { ...errors, amount: "Amount must be integer" };
    }
  }
  if (states.feeRate) {
    if (Number(states.feeRate) < 1) {
      errors = { ...errors, feeRate: "Fee rate must be at least 1" };
    }
    if (!validator.isInt(states.feeRate)) {
      errors = { ...errors, feeRate: "Fee rate must be integer" };
    }
  }
  if (states.opReturnData) {
    const data = Buffer.from(states.opReturnData, "utf8");
    if (data.byteLength > 80) {
      errors = { ...errors, opReturnData: "Data exceeds 80 bytes" };
    }
  }
  return errors;
};

export default function TransactionScreen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const { navigate } = useRouter();
  const keyboard = useAnimatedKeyboard();
  const addressRef = useRef<RNTextInput>(null);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [feeRate, setFeeRate] = useState("");
  const [rbf, setRbf] = useState(true);
  const [opReturnData, setOpReturnData] = useState("");

  const [more, setMore] = useState(false);
  const [errors, setErrors] = useState<States>({});

  const params = useGlobalSearchParams<{ id: string }>();
  const { data: utxos, isLoading } = useGetUtxos(params.id, true);
  const noUtxos = utxos?.length === 0 && !isLoading;

  const emptyState = !address || !amount || !feeRate;
  const hasErrors = !!Object.values(errors).length;
  const disabled = noUtxos || emptyState || isLoading || hasErrors;

  useEffect(() => {
    setErrors(validateStates({ address, amount, feeRate, opReturnData }));
  }, [address, amount, feeRate, opReturnData]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Section text="Fill transaction">
          <TextInput
            ref={addressRef}
            right={
              <TextInput.Icon
                icon="clipboard"
                onPress={() => {
                  Clipboard.getString().then((text) => {
                    if (text) {
                      setAddress(text);
                      addressRef.current?.setNativeProps({
                        text,
                      });
                    }
                  });
                }}
              />
            }
            mode="outlined"
            onChangeText={(v) => setAddress(v)}
            label={"Address"}
          />
          <TextInput
            mode="outlined"
            keyboardType="decimal-pad"
            onChangeText={(v) => setAmount(v)}
            label={"Amount (satoshi)"}
          />
          <Text variant="labelMedium">
            {`${Number(amount)} satoshi = ${
              Number(amount) / Math.pow(10, AccountBTC.decimals)
            } btc`}
          </Text>
          <TextInput
            mode="outlined"
            keyboardType="decimal-pad"
            onChangeText={(v) => setFeeRate(v)}
            label={"Fee rate (sats/vB)"}
          />
          <Text variant="labelMedium">
            2 sats/vB is usually enough for testnet to include tx into first
            block
          </Text>

          {more && (
            <View
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
              <TextInput
                mode="outlined"
                keyboardType="decimal-pad"
                onChangeText={(v) => setOpReturnData(v)}
                label={"OP_RETURN data"}
              />
              <Text variant="labelMedium">
                80 bytes of data that will be stored in the chain as unspendable
                transaction
              </Text>
            </View>
          )}
          <View style={{ alignItems: "flex-end" }}>
            {more ? (
              <Button onPress={() => setMore(false)}>Less</Button>
            ) : (
              <Button onPress={() => setMore(true)}>More</Button>
            )}
          </View>
        </Section>

        <Section text="Those are your UTXOS that are going to be used to make this transaction">
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.utxosContainer}>
              {noUtxos && (
                <Text variant="bodyMedium">No utxos to spent :(</Text>
              )}
              {utxos?.map((utxo) => (
                <UtxoCard key={utxo.tx_id} utxo={utxo} small selected />
              ))}
            </View>
          )}
        </Section>
        <View>
          {Object.values(errors).map((v) => (
            <Text style={styles.error}>{`• ${v}`}</Text>
          ))}
        </View>
        <Button
          disabled={disabled}
          onPress={() => {
            navigate(
              // @ts-ignore
              `/(tabs)/wallet/${params.id}/(tabs)/transaction/submit?address=${address}&amount=${amount}&feeRate=${feeRate}&rbf=${rbf}&opReturnData=${opReturnData}`
            );
          }}
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
    utxosContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    error: {
      color: theme.colors.error,
    },
    title: {
      color: theme.colors.onSurfaceVariant,
      marginVertical: theme.sizes.s,
    },
  });
