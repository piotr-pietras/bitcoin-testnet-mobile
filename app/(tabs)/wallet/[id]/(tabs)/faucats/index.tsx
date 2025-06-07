import { AppTheme, useTheme } from "@/services/theme";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { getWallet, WalletStoredInfo } from "@/services/storage";
import { Section } from "@/components/Section";
import { Ionicons } from "@expo/vector-icons";
import { Button, Text } from "react-native-paper";
import { Faucats } from "@/types/global";
import { Net } from "@/types/global";
import Clipboard from "@react-native-clipboard/clipboard";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export default function FaucatsScreen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const { navigate } = useRouter();
  const [wallet, setWallet] = useState<WalletStoredInfo | null>(null);

  const params = useGlobalSearchParams<{ id: string }>();

  useEffect(() => {
    getWallet(params.id).then((wallet) => {
      setWallet(wallet);
    });
  }, [params.id]);

  if (!wallet) return null;
  if (wallet.type === "p2pkh") {
    return (
      <View style={styles.center}>
        <Text variant="titleMedium">📢 P2PKH wallet detected</Text>
        <Text variant="bodyLarge" style={[styles.label, styles.textCenter]}>
          Faucats do not support p2pkh wallet address. You can create a p2wpkh
          wallet, get coins and send to your p2pkh wallet. You can create a
          p2wpkh wallet in the wallet settings.
        </Text>
      </View>
    );
  }

  const copyToClipboard = () => {
    Clipboard.setString(wallet.address);
    Toast.show({ type: "success", text1: "Wallet address has been copied" });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Section text="Faucats">
          <Text variant="labelMedium" style={styles.label}>
            Please note that faucats are not limitless source of coins. Even
            though coins have no value someone put a effort to mine them.
          </Text>
          <Text variant="labelMedium" style={styles.label}>
            You usually need to wait for some time like 24h to get new pool of
            coins. This is mechanism that prevents abuse of faucat.
          </Text>
          <View style={styles.contentContainer}>
            {Object.entries(Faucats[wallet?.net as Net]).map(([key]) => (
              <TouchableOpacity
                key={key}
                style={styles.link}
                onPress={() =>
                  navigate({
                    pathname: "/(tabs)/wallet/[id]/(tabs)/faucats/[faucat]",
                    params: {
                      id: params.id,
                      faucat: key,
                    },
                  })
                }
              >
                <Ionicons
                  size={theme.sizes.l}
                  color={theme.colors.onSurface}
                  name="globe-outline"
                />
                <Text variant="titleMedium">{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>
        <View>
          <Text variant="labelMedium" style={[styles.label, styles.textCenter]}>
            You are going to need wallet address on faucat website. Copy it to
            clipboard with button below.
          </Text>
          <Button icon="clipboard" onPress={copyToClipboard}>
            Copy wallet address
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.sizes.m,
      gap: theme.sizes.l,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    label: {
      color: theme.colors.onSurfaceVariant,
    },
    textCenter: {
      textAlign: "center",
    },
    contentContainer: {
      padding: theme.sizes.m,
      borderRadius: theme.sizes.m,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.outline,
      gap: theme.sizes.m,
    },
    link: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.sizes.s,
    },
  });
