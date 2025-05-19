import React from "react";
import { Tabs, useRouter } from "expo-router";
import { Chip } from "react-native-paper";
import { AppTheme, useTheme } from "@/services/theme";
import { ScrollView, View, StyleSheet } from "react-native";

export const WALLET_TABBAR_HEIGHT = 54;

export default function TabLayout() {
  const theme = useTheme();
  const { navigate } = useRouter();
  const styles = stylesBuilder(theme);

  return (
    <Tabs
      tabBar={(props) => (
        <View style={styles.container}>
          <ScrollView horizontal>
            {Object.values(props.descriptors).map((v) => (
              <Chip
                selected={
                  v.route.name === props.state.routeNames[props.state.index]
                }
                showSelectedOverlay
                onPress={() => v.navigation.navigate(v.route.name)}
                style={styles.chip}
              >
                {v.options.title}
              </Chip>
            ))}
          </ScrollView>
        </View>
      )}
      screenOptions={{
        tabBarStyle: { height: theme.sizes.xxl },
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTitleStyle: { color: theme.colors.onSurface },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Wallet",
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: "Transaction",
          freezeOnBlur: true,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="utxos"
        options={{
          title: "UTXOs",
          unmountOnBlur: true,
        }}
      />
    </Tabs>
  );
}

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    chip: {
      margin: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      backgroundColor: theme.colors.surface,
      height: WALLET_TABBAR_HEIGHT,
    },
  });
