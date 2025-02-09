import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function Layout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.onSurface },
        contentStyle: { backgroundColor: colors.background },
        title: "Generate new wallet",
        animation: "fade",
        headerBackVisible: false,
      }}
    ></Stack>
  );
}
