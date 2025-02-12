import { Modal, ModalRef } from "@/components/Modal";
import { WalletCard } from "@/components/WalletCard";
import { useNewWalletContext } from "@/context/NewWalletContext";
import {
  getInfoFaucat,
  getWallets,
  setInfoFaucat,
  WalletStoredInfo,
} from "@/services/storage";
import { AppTheme, useTheme } from "@/services/theme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import Animated, { FadeIn, SlideInLeft } from "react-native-reanimated";

export default function WalletsScreen() {
  const infoFaucatModal = useRef<null | ModalRef>(null);
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const { navigate } = useRouter();
  const nw = useNewWalletContext();
  const [wallets, setWallets] = useState<WalletStoredInfo[]>([]);

  const loadWallets = () => {
    getWallets().then((v) => setWallets(v));
  };

  useFocusEffect(() => {
    loadWallets();
  });

  useEffect(() => {
    if (wallets.length > 0) {
      getInfoFaucat().then((v) => {
        if (!v) {
          infoFaucatModal.current?.open();
        }
      });
    }
  }, [wallets]);

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.contentContainer}>
            {wallets.map((v, i) => (
              <Animated.View entering={SlideInLeft.delay(100 * i)}>
                <WalletCard
                  key={v.id}
                  wallet={v}
                  onWalletRemoved={() => loadWallets()}
                />
              </Animated.View>
            ))}
          </View>
          <View style={styles.addViewAvoid} />
        </ScrollView>
        <Animated.View entering={FadeIn}>
          <IconButton
            size={theme.sizes.l}
            onPress={() => {
              if (nw) {
                nw?.startNewWallet();
                navigate("/new-wallet/step1");
              }
            }}
            style={styles.add}
            icon={() => (
              <Ionicons
                name={"add-outline"}
                size={theme.sizes.l}
                color={theme.colors.onPrimary}
              />
            )}
          />
        </Animated.View>
        <Text style={styles.label}>Powered by Mempool & Blockdaemon</Text>
      </View>
      <Modal ref={infoFaucatModal}>
        <Text variant="bodyLarge">
          In order to get some test coins you need to visit a testnet3 faucats
          and paste your p2wpkh wallet's address. You can find some links to
          faucats in tab "More".
        </Text>
        <TouchableOpacity
          onPress={() =>
            setInfoFaucat(true).then(() => infoFaucatModal.current?.close())
          }
          hitSlop={10}
        ></TouchableOpacity>
        <View style={styles.okContainer}>
          <Button
            onPress={() => {
              setInfoFaucat(true).then(() => infoFaucatModal.current?.close());
            }}
          >
            Ok
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
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      flex: 1,
      padding: theme.sizes.m,
      gap: theme.sizes.m,
    },
    add: {
      position: "absolute",
      bottom: theme.sizes.m,
      right: theme.sizes.m,
      backgroundColor: theme.colors.primary,
    },
    addViewAvoid: {
      height: theme.sizes.xxl + theme.sizes.m,
    },
    label: {
      position: "absolute",
      width: "100%",
      bottom: 0,
      color: theme.colors.onSurfaceVariant,
      textAlign: "center",
    },
    info: {
      position: "absolute",
      width: "100%",
      bottom: 40,
    },
    okContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    link: {
      color: theme.colors.surfaceVariant,
      textDecorationLine: "underline",
    },
  });
