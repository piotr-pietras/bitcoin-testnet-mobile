import { Modal, ModalRef } from "@/components/Modal";
import { WebViewMempool } from "@/components/WebViewMempool";
import { useUnmountOnBlur } from "@/hooks/useUnmountOnBlur";
import {
  getInfoFaucat,
  getWallet,
  setInfoFaucat,
  WalletStoredInfo,
} from "@/services/storage";
import { AppTheme, useTheme } from "@/services/theme";
import { NetNamePath } from "@/types/global";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Animated, { FadeIn } from "react-native-reanimated";

export default function WalletsScreen() {
  const infoFaucatModal = useRef<ModalRef>(null);
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const { navigate } = useRouter();
  const [wallet, setWallet] = useState<WalletStoredInfo | undefined>(undefined);
  const params = useGlobalSearchParams<{ id: string }>();

  useEffect(() => {
    getWallet(params.id).then((v) => setWallet(v));
  }, [params.id]);

  useEffect(() => {
    if (!wallet) return;
    getInfoFaucat().then((v) => {
      if (!v) {
        infoFaucatModal.current?.open();
      }
    });
  }, [wallet]);

  return (
    <>
      <View style={styles.container}>
        {wallet && (
          <WebViewMempool
            uri={`https://mempool.space/${
              NetNamePath[wallet?.net || "TEST"]
            }/address/${wallet?.address}`}
          />
        )}
      </View>
      <Modal ref={infoFaucatModal}>
        <Text variant="bodyLarge">
          In order to get some bitcoin testnet coins 🪙 you need to visit a
          testnet faucats.
        </Text>
        <View style={styles.okContainer}>
          <Button
            onPress={() => {
              setInfoFaucat(true).then(() => {
                navigate({
                  pathname: "/(tabs)/wallet/[id]/(tabs)/faucats",
                  params: { id: params.id },
                });
                infoFaucatModal.current?.close();
              });
            }}
          >
            Go to faucat
          </Button>
        </View>
      </Modal>
    </>
  );
}

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    okContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  });
