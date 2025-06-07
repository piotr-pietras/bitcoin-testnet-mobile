import { Stack } from "expo-router";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();

  return (
    <Stack
      screenLayout={({ children }) => (
        <View style={{ flex: 1, paddingTop: top }}>{children}</View>
      )}
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.onSurface },
        contentStyle: { backgroundColor: colors.background },
        title: "Generate new wallet",
        headerShown: false,
      }}
    >
      <Stack.Screen name="step1" options={{ animation: "slide_from_left" }} />
      <Stack.Screen name="step2" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}
