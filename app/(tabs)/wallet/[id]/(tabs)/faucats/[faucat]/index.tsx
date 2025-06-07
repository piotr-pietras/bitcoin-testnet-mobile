import { AppTheme, useTheme } from "@/services/theme";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { getWallet, WalletStoredInfo } from "@/services/storage";
import { Faucats } from "@/types/global";
import { Net } from "@/types/global";
import WebView from "react-native-webview";

export default function FaucatsScreen() {
  const webview = useRef<WebView>(null);
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const [wallet, setWallet] = useState<WalletStoredInfo | null>(null);

  const params = useGlobalSearchParams<{ id: string; faucat: string }>();

  useEffect(() => {
    getWallet(params.id).then((wallet) => {
      setWallet(wallet);
    });
  }, [params.id]);

  if (!wallet) return null;

  return (
    <View style={styles.container}>
      <WebView
        ref={webview}
        source={{
          uri: Faucats[wallet?.net as Net][params.faucat],
        }}
      />
    </View>
  );
}

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });
