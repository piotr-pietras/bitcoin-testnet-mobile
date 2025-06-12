import IconButton from "@/components/IconButton";
import { WalletCard } from "@/components/WalletCard";
import { useNewWalletContext } from "@/context/NewWalletContext";
import { getWallets, WalletStoredInfo } from "@/services/storage";
import { AppTheme, useTheme } from "@/services/theme";
import { Net } from "@/types/global";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SegmentedButtons, Text } from "react-native-paper";
import Animated, {
  FadeIn,
  LinearTransition,
  SlideInDown,
} from "react-native-reanimated";

export default function WalletsScreen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const { navigate } = useRouter();
  const nw = useNewWalletContext();
  const { testnet } = useLocalSearchParams();
  const [wallets, setWallets] = useState<WalletStoredInfo[]>([]);
  const [net, setNet] = useState<Net>("TEST4");
  const filteredWallets = useMemo(
    () => wallets.filter((v) => v.net === net),
    [wallets, net]
  );

  const loadWallets = () => {
    getWallets().then((v) => setWallets(v));
  };

  useEffect(() => {
    loadWallets();
  }, [net]);

  useEffect(() => {
    if (testnet === "TEST") {
      setNet("TEST");
    } else if (testnet === "TEST4") {
      setNet("TEST4");
    }
  }, [testnet]);

  useFocusEffect(
    useCallback(() => {
      loadWallets();
    }, [])
  );

  return (
    <View style={styles.container}>
      <SegmentedButtons
        style={styles.segmentedButtons}
        value={net}
        onValueChange={(v) => setNet(v as Net)}
        buttons={[
          {
            value: "TEST",
            label: "Testnet3",
          },
          {
            value: "TEST4",
            label: "Testnet4",
          },
        ]}
      />
      <Animated.FlatList
        style={styles.contentContainer}
        data={filteredWallets}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text variant="labelLarge" style={styles.label}>No wallets found</Text>
          </View>
        )}
        itemLayoutAnimation={LinearTransition}
        renderItem={({ item, index }) => (
          <Animated.View key={item.id} entering={SlideInDown.delay(50 * index)}>
            <WalletCard wallet={item} onWalletRemoved={() => loadWallets()} />
          </Animated.View>
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        ListFooterComponent={() => <View style={styles.addViewAvoid} />}
      />
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
      <Text style={styles.bottomLabel}>
        Powered by Mempool, Blockdaemon, bitcoin-js
      </Text>
    </View>
  );
}

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    segmentedButtons: {
      margin: theme.sizes.m,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: theme.sizes.m,
    },
    itemSeparator: {
      height: theme.sizes.m,
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
      color: theme.colors.onSurfaceVariant,
    },
    bottomLabel: {
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
    link: {
      color: theme.colors.surfaceVariant,
      textDecorationLine: "underline",
    },
  });
