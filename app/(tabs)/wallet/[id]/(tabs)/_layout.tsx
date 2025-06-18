import React from "react";
import { Tabs } from "expo-router";
import { Chip } from "react-native-paper";
import { AppTheme, useTheme } from "@/services/theme";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const WALLET_TABBAR_HEIGHT = 54;

export default function TabLayout() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const { top } = useSafeAreaInsets();

  return (
    <Tabs
      tabBar={(props) => (
        <View style={styles.container}>
          <ScrollView horizontal>
            {Object.values(props.descriptors).map((v) => {
              const selected =
                v.route.name === props.state.routeNames[props.state.index];
              return (
                <Chip
                  hitSlop={10}
                  key={v.route.name}
                  showSelectedOverlay
                  onPress={() => v.navigation.navigate(v.route.name)}
                  style={[
                    styles.chip,
                    selected ? styles.selectedChip : undefined,
                  ]}
                  textStyle={selected ? styles.selectedChipText : undefined}
                  mode="outlined"
                >
                  {v.options.title}
                </Chip>
              );
            })}
          </ScrollView>
        </View>
      )}
      screenOptions={{
        tabBarStyle: { height: theme.sizes.xxl },
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTitleStyle: { color: theme.colors.onSurface },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          sceneStyle: {
            paddingTop: top,
            backgroundColor: theme.colors.background,
          },
          title: "Wallet",
          freezeOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: "Transaction",
          popToTopOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="faucats"
        options={{
          title: "Faucats",
          popToTopOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="utxos"
        options={{
          title: "UTXOs",
        }}
      />
      <Tabs.Screen
        name="info/index"
        options={{
          sceneStyle: {
            paddingTop: top,
            backgroundColor: theme.colors.background,
          },
          title: "Info",
          freezeOnBlur: true,
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
    selectedChip: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.sizes.m,
    },
    selectedChipText: {
      color: theme.colors.onPrimary,
      fontWeight: "bold",
    },
    container: {
      backgroundColor: theme.colors.surface,
      height: WALLET_TABBAR_HEIGHT,
    },
  });
