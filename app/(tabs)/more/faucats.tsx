import { AppTheme, useTheme } from "@/services/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Text } from "react-native-paper";
import { Section } from "@/components/Section";
import { Ionicons } from "@expo/vector-icons";

export default function FaucatsScreen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);

  return (
    <View style={styles.container}>
      <Section text="Note that most faucats expects p2wpkh address. If you don't need coins any more send them back to the faucat.">
        <View style={styles.contentContainer}>
          <Text variant="labelLarge">Testnet4</Text>
          <TouchableOpacity
            style={styles.link}
            onPress={() =>
              WebBrowser.openBrowserAsync(
                "https://coinfaucet.eu/en/btc-testnet4/"
              )
            }
          >
            <Ionicons
              size={theme.sizes.l}
              color={theme.colors.onSurface}
              name="globe-outline"
            />
            <Text variant="bodyLarge">coinfaucet.eu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() =>
              WebBrowser.openBrowserAsync("https://faucet.testnet4.dev/")
            }
          >
            <Ionicons
              size={theme.sizes.l}
              color={theme.colors.onSurface}
              name="globe-outline"
            />
            <Text variant="bodyLarge">faucet.testnet4.dev</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text variant="labelLarge">Testnet3</Text>
          <TouchableOpacity
            style={styles.link}
            onPress={() =>
              WebBrowser.openBrowserAsync(
                "https://coinfaucet.eu/en/btc-testnet/"
              )
            }
          >
            <Ionicons
              size={theme.sizes.l}
              color={theme.colors.onSurface}
              name="globe-outline"
            />
            <Text variant="bodyLarge">coinfaucet.eu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() =>
              WebBrowser.openBrowserAsync(
                "https://faucet.triangleplatform.com/bitcoin/testnet"
              )
            }
          >
            <Ionicons
              size={theme.sizes.l}
              color={theme.colors.onSurface}
              name="globe-outline"
            />
            <Text variant="bodyLarge">faucet.triangleplatform.com</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() =>
              WebBrowser.openBrowserAsync("https://tbtc.bitaps.com/")
            }
          >
            <Ionicons
              size={theme.sizes.l}
              color={theme.colors.onSurface}
              name="globe-outline"
            />
            <Text variant="bodyLarge">tbtc.bitaps.com</Text>
          </TouchableOpacity>
        </View>
      </Section>
    </View>
  );
}

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.sizes.m,
      gap: theme.sizes.l,
    },
    contentContainer: {
      padding: theme.sizes.m,
      borderRadius: theme.sizes.m,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      gap: theme.sizes.s,
    },
    label: {
      color: theme.colors.onSurfaceVariant,
    },
    link: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.sizes.s,
    },
  });
