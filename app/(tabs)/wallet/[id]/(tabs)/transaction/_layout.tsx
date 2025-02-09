import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { useTheme, Text } from "react-native-paper";

export default function Layout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        title: "Submit transaction",
        animation: "fade",
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.onSurface,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Create and sign",
        }}
      />
      <Stack.Screen name="submit" options={{ title: "Submit" }} />
      <Stack.Screen name="[txId]/index" options={{ title: "Transaction" }} />
    </Stack>
  );
}
