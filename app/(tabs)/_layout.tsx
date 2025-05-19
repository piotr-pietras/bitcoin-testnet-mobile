import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native-paper";
import { theme, useTheme } from "@/services/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";

export const MAIN_TABBAR_HEIGHT = theme.sizes.xxl;

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.onSurface },
        tabBarStyle: {
          height: MAIN_TABBAR_HEIGHT,
          backgroundColor: colors.surface,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Wallets",
          freezeOnBlur: true,
          tabBarLabel: ({ focused }) => {
            if (Device.deviceType === Device.DeviceType.TABLET) return;
            return (
              <Text
                variant="titleMedium"
                style={{ color: focused ? colors.primary : colors.backdrop }}
              >
                Wallets
              </Text>
            );
          },
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={"wallet"}
              size={size}
              color={focused ? colors.primary : colors.backdrop}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          headerShown: false,
          freezeOnBlur: true,
          tabBarLabel: ({ focused }) => {
            if (Device.deviceType === Device.DeviceType.TABLET) return;
            return (
              <Text
                variant="titleMedium"
                style={{ color: focused ? colors.primary : colors.backdrop }}
              >
                More
              </Text>
            );
          },
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={"settings"}
              size={size}
              color={focused ? colors.primary : colors.backdrop}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet/[id]/(tabs)"
        options={{
          href: null,
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
    </Tabs>
  );
}
