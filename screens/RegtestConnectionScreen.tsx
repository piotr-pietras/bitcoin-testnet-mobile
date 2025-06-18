import { useRegtestContext } from "@/context/RegtestContext";
import { AppTheme, useTheme } from "@/services/theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Section } from "../components/Section";
import { Ionicons } from "@expo/vector-icons";

export const RegtestConnectionScreen = () => {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const { connect, isConnected, disconnect } = useRegtestContext();
  const [isLoading, setIsLoading] = useState(false);
  const [regtestAddress, setRegtestAddress] = useState("http://10.0.2.2:18443");
  const [rpcUser, setRpcUser] = useState("test");
  const [rpcPassword, setRpcPassword] = useState("test");

  if (isConnected) {
    return (
      <View style={styles.container}>
        <Button onPress={() => disconnect()}>
          Disconnect regtest connection
        </Button>
        <Text>Connected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Section text="Connect to regtest">
        <TextInput
          mode="outlined"
          label="Regtest address"
          value={regtestAddress}
          onChangeText={setRegtestAddress}
        />
        <TextInput
          mode="outlined"
          label="RPC user"
          value={rpcUser}
          onChangeText={setRpcUser}
        />
        <TextInput
          mode="outlined"
          label="RPC password"
          value={rpcPassword}
          onChangeText={setRpcPassword}
        />
        <Button
          icon={() => (
            <Ionicons
              name="server-outline"
              size={theme.sizes.xm}
              color={theme.colors.onPrimary}
            />
          )}
          loading={isLoading}
          disabled={isLoading}
          labelStyle={{ color: theme.colors.onPrimary }}
          mode="contained"
          onPress={async () => {
            setIsLoading(true);
            await connect(regtestAddress, rpcUser, rpcPassword);
            setIsLoading(false);
          }}
        >
          Connect
        </Button>
      </Section>
      <View>
        <Text variant="labelMedium" style={styles.label}>
          If you are having trouble to initialize regtest or connect to it try
          guide below.
        </Text>
        <Button
          icon={() => (
            <Ionicons
              name="accessibility-outline"
              size={theme.sizes.xm}
              color={theme.colors.primary}
            />
          )}
          onPress={() => {}}
        >
          Get some guidance
        </Button>
      </View>
    </View>
  );
};

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.sizes.m,
      gap: theme.sizes.l,
    },
    label: {
      width: "100%",
      bottom: 0,
      color: theme.colors.onSurfaceVariant,
      textAlign: "center",
    },
  });
