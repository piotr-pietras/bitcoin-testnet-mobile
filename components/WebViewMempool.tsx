import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import WebView from "react-native-webview";
import { StyleSheet, View } from "react-native";
import { AppTheme, useTheme } from "@/services/theme";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "./IconButton";
import Animated, { FadeIn } from "react-native-reanimated";
import { ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "expo-router";

type Props = {
  uri: string;
};

export const WebViewMempool = ({ uri }: Props) => {
  const webview = useRef<WebView>(null);
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const styles = stylesBuilder(theme);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, [])
  );

  useEffect(() => {
    return () => {
      setLoading(true);
    };
  }, []);

  useEffect(() => {
    webview.current?.reload();
  }, [uri]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <View style={styles.container}>
        <IconButton
          rotate
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
          style={styles.webview}
          injectedJavaScript={`
          function backgroundColor() {
            let elements = document.getElementsByTagName("body");
            elements[0].style.backgroundColor = "#11131F";
          };
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

          backgroundColor();
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
    </View>
  );
};

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1,
      zIndex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    webview: {
      backgroundColor: theme.colors.background,
    },
    refresh: {
      position: "absolute",
      bottom: theme.sizes.m,
      right: theme.sizes.m,
      zIndex: 1,
      backgroundColor: theme.colors.primary,
    },
  });
