import { ButtonSection } from "@/components/ButtonSecton";
import { AppTheme, useTheme } from "@/services/theme";
import { StyleSheet, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";

export default function MoreScreen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const { navigate } = useRouter();

  return (
    <View style={styles.container}>
      <ButtonSection
        buttons={[
          {
            text: "Faucats",
            iconName: "water",
            onPress() {
              navigate("/(tabs)/more/faucats");
            },
          },
          {
            text: "Source code",
            iconName: "logo-github",
            onPress() {
              WebBrowser.openBrowserAsync(
                "https://github.com/piotr-pietras/bitcoin-test-wallet"
              );
            },
          },
        ]}
      />
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
  });
