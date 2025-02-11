import { useRef } from "react";
import WebView from "react-native-webview";
import { StyleSheet, View } from "react-native";
import { AppTheme, useTheme } from "@/services/theme";
import { IconButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  uri: string;
};

export const WebViewMempool = ({ uri }: Props) => {
  const webview = useRef<WebView>(null);
  const theme = useTheme();
  const styles = stylesBuilder(theme);

  return (
    <View style={styles.container}>
      <IconButton
        size={theme.sizes.l}
        style={styles.refresh}
        onPress={() => webview.current?.reload()}
        icon={() => (
          <Ionicons
            size={theme.sizes.l}
            name="refresh"
            color={theme.colors.onPrimary}
          />
        )}
      />

      <WebView
        ref={webview}
        injectedJavaScript={`
          function hideHeader() {
            let elements = document.getElementsByTagName("header");
            for (let i = 0; i < elements.length; i++) {
              elements[i].style.display = "none";
            }
          };
          function hideFooter() {
            let elements = document.getElementsByTagName("footer");
            for (let i = 0; i < elements.length; i++) {
              elements[i].style.display = "none";
            }
          };

          hideHeader();
          hideFooter();

          let lastUrl = location.href;
          setInterval(() => {
            if (location.href !== lastUrl) {
              lastUrl = location.href;
              hideHeader();
              hideFooter();
            }
          }, 100);
        `}
        source={{
          uri,
        }}
      />
    </View>
  );
};

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    refresh: {
      position: "absolute",
      bottom: theme.sizes.m,
      right: theme.sizes.m,
      zIndex: 1,
      backgroundColor: theme.colors.primary,
    },
  });
