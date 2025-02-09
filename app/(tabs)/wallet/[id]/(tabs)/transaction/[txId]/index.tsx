import { useTheme } from "@/services/theme";
import { Stack, useGlobalSearchParams } from "expo-router";
import { View } from "react-native";

import { WebViewMempool } from "@/components/WebViewMempool";

export default function TransactionScreen() {
  const theme = useTheme();
  const params = useGlobalSearchParams<{
    txId: string;
  }>();

  return (
    <>
      <Stack.Screen
        options={{
          title: `Transaction: ${params.txId}`,
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTitleStyle: { color: theme.colors.onSurface },
        }}
      />
      <View style={{ flex: 1 }}>
        <WebViewMempool
          uri={`https://mempool.space/testnet/tx/${params?.txId}`}
        />
      </View>
    </>
  );
}
