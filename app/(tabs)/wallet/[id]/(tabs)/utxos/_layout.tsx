import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();

  return (
    <Stack
      screenOptions={{
        title: "UTXOs",
        animation: "fade",
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.onSurface,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "UTXOs",
          headerShown: false,
          contentStyle: { backgroundColor: colors.background, paddingTop: top },
        }}
      />
      <Stack.Screen name="[txId]/index" options={{ title: "UTXO" }} />
    </Stack>
  );
}
