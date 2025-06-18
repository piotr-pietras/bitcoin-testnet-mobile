import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();

  return (
    <Stack
      screenOptions={{
        title: "Faucats",
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
      <Stack.Screen
        name="[faucat]"
        options={{
          headerShown: true,
        }}
      />
    </Stack>
  );
}
