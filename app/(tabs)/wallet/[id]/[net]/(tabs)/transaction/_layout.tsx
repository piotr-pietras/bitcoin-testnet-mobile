import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();

  return (
    <Stack
      screenOptions={{
        title: "Submit transaction",
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.background, paddingTop: top },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.onSurface,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="submit" options={{ title: "Submit" }} />
      <Stack.Screen
        name="[txId]/index"
        options={{ title: "Transaction", contentStyle: { paddingTop: 0 } }}
      />
    </Stack>
  );
}
