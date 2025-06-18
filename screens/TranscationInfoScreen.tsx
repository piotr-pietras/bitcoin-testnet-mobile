import { useTheme } from "@/services/theme";
import { Stack, useGlobalSearchParams } from "expo-router";
import { View } from "react-native";
import React from "react";
import { WebViewMempool } from "@/components/WebViewMempool";
import { Net, NetNamePath } from "@/types/global";

export function TransactionInfoScreen() {
  const theme = useTheme();
  const params = useGlobalSearchParams<{
    txId: string;
    net: Net;
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
          uri={`https://mempool.space/${NetNamePath[params.net]}/tx/${params?.txId}`}
        />
      </View>
    </>
  );
}
