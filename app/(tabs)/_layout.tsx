import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native-paper";
import { useTheme } from "@/services/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { colors, sizes } = useTheme();
  const { bottom, top } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          height: bottom + sizes.xxl,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          sceneStyle: {
            paddingTop: top,
            backgroundColor: colors.background,
          },
          title: "Wallets",
          headerShown: false,
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
        }}
      />
    </Tabs>
  );
}
