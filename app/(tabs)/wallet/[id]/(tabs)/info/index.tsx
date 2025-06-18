import { Section } from "@/components/Section";
import { getWallet, getWalletPrivKey } from "@/services/storage";
import { AppTheme, useTheme } from "@/services/theme";
import { useEffect } from "react";
import { useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { AccountBTC } from "@/services/btc/AccountBTC";
import Clipboard from "@react-native-clipboard/clipboard";
import { Ionicons } from "@expo/vector-icons";

export default function InfoScreen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const params = useGlobalSearchParams<{ id: string }>();
  const [accountBtc, setAccountBtc] = useState<AccountBTC | null>(null);

  useEffect(() => {
    (async () => {
      const wallet = await getWallet(params.id);
      const privKey = await getWalletPrivKey(params.id);
      const accountBtc = new AccountBTC(privKey, wallet.net, wallet.type);
      setAccountBtc(accountBtc);
    })();
  }, [params.id]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Section text="Wallet info">
          <TextInput
            disabled
            right={
              <TextInput.Icon
                icon={() => (
                  <Ionicons
                    size={theme.sizes.xm}
                    color={theme.colors.onSurfaceDisabled}
                    name="copy"
                  />
                )}
                onPress={() =>
                  Clipboard.setString(
                    accountBtc?.ecPair.privateKey?.toString("hex") || ""
                  )
                }
              />
            }
            mode="outlined"
            label="Private key"
            value={accountBtc?.ecPair.privateKey?.toString("hex")}
            multiline={true}
            numberOfLines={2}
          />
          <TextInput
            disabled
            right={
              <TextInput.Icon
                icon={() => (
                  <Ionicons
                    size={theme.sizes.xm}
                    color={theme.colors.onSurfaceDisabled}
                    name="copy"
                  />
                )}
                onPress={() =>
                  Clipboard.setString(
                    accountBtc?.ecPair.publicKey?.toString("hex") || ""
                  )
                }
              />
            }
            mode="outlined"
            label="Public key"
            value={accountBtc?.ecPair.publicKey?.toString("hex")}
            multiline={true}
            numberOfLines={2}
          />
          <TextInput
            disabled
            right={
              <TextInput.Icon
                icon={() => (
                  <Ionicons
                    size={theme.sizes.xm}
                    color={theme.colors.onSurfaceDisabled}
                    name="copy"
                  />
                )}
                onPress={() => Clipboard.setString(accountBtc?.address || "")}
              />
            }
            mode="outlined"
            label="Address"
            value={accountBtc?.address}
            multiline={true}
            numberOfLines={2}
          />
          <TextInput
            disabled
            mode="outlined"
            label="Address type"
            value={accountBtc?.type}
          />
          <TextInput
            disabled
            mode="outlined"
            label="Net"
            value={accountBtc?.net}
          />
        </Section>
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
  });
