import { ButtonSection } from "@/components/ButtonSection";
import { AppTheme, useTheme } from "@/services/theme";
import { StyleSheet, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { Text } from "react-native-paper";
import React from "react";
import { useRegtestContext } from "@/context/RegtestContext";

export default function MoreScreen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const { navigate } = useRouter();
  const rt = useRegtestContext();

  return (
    <>
      <View style={styles.container}>
        <ButtonSection
          buttons={[
            {
              text: "Source code",
              iconName: "logo-github",
              onPress() {
                WebBrowser.openBrowserAsync(
                  "https://github.com/piotr-pietras/bitcoin-testnet-mobile"
                );
              },
            },
            {
              text: "Disconnect regtest",
              iconName: "server-outline",
              disabled: !rt.isConnected,
              onPress() {
                rt.disconnect();
              },
            },
          ]}
        />
        <Text style={styles.label}>
          Powered by Mempool, Blockdaemon, bitcoin-js
        </Text>
      </View>
    </>
  );
}

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: theme.sizes.l,
    },
    label: {
      position: "absolute",
      width: "100%",
      bottom: 0,
      color: theme.colors.onSurfaceVariant,
      textAlign: "center",
    },
  });
