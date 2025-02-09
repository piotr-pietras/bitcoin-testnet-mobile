import { WebViewMempool } from "@/components/WebViewMempool";
import { getWallet, WalletStoredInfo } from "@/services/storage";
import { useTheme } from "@/services/theme";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function WalletsScreen() {
  const { colors } = useTheme();
  const [wallet, setWallet] = useState<WalletStoredInfo | undefined>(undefined);
  const params = useGlobalSearchParams<{ id: string }>();

  useEffect(() => {
    getWallet(params.id).then((v) => setWallet(v));
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: `Wallet`,
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { color: colors.onSurface },
        }}
      />
      <View style={{ flex: 1 }}>
        {wallet && (
          <WebViewMempool
            uri={`https://mempool.space/testnet/address/${wallet?.address}`}
          />
        )}
      </View>
    </>
  );
}
