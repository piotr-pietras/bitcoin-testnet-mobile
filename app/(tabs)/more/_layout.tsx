import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function Layout() {
  const { colors } = useTheme();

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        title: "More",
        animation: "fade",
        headerStyle: { backgroundColor: colors.surface },
        contentStyle: { backgroundColor: colors.background },
        headerTintColor: colors.onSurface,
      }}
    >
      <Stack.Screen name="index" options={{ title: "More" }} />
      <Stack.Screen name="faucats" options={{ title: "Faucats" }} />
    </Stack>
  );
}
