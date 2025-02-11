import React from "react";
import { Tabs } from "expo-router";
import {  Text } from "react-native-paper";
import { useTheme } from "@/services/theme";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const { colors, sizes } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {backgroundColor: colors.surface},
        headerTitleStyle: {color: colors.onSurface},
        tabBarStyle: { height: sizes.xxl, backgroundColor: colors.surface },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Wallets",
          unmountOnBlur: true,
          tabBarLabel: ({ focused }) => (
            <Text
              variant="titleMedium"
              style={{ color: focused ? colors.primary : colors.backdrop }}
            >
              Wallets
            </Text>
          ),
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
          headerShown:false,
          unmountOnBlur: true,
          tabBarLabel: ({ focused }) => (
            <Text
              variant="titleMedium"
              style={{ color: focused ? colors.primary : colors.backdrop }}
            >
              More
            </Text>
          ),
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
