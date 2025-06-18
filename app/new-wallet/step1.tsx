import { Section } from "@/components/Section";
import { useNewWalletContext } from "@/context/NewWalletContext";
import { AppTheme, useTheme } from "@/services/theme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, RadioButton, Text, TextInput } from "react-native-paper";
import Animated, { useAnimatedKeyboard } from "react-native-reanimated";

export default function Step1Screen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const nw = useNewWalletContext();
  const keyboard = useAnimatedKeyboard();

  const { dismiss } = useRouter();

  return (
    <ScrollView>
      <View style={styles.container}>
        <Section text="Testnet chain">
          <TouchableOpacity
            onPress={() => nw.setNet("TEST")}
            style={styles.radio}
          >
            <View style={{ pointerEvents: "none" }}>
              <RadioButton
                value={"TEST"}
                status={nw.net === "TEST" ? "checked" : "unchecked"}
              />
            </View>
            <Text variant="labelLarge">Testnet3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => nw.setNet("TEST4")}
            style={styles.radio}
          >
            <View style={{ pointerEvents: "none" }}>
              <RadioButton
                value={"TEST4"}
                status={nw.net === "TEST4" ? "checked" : "unchecked"}
              />
            </View>
            <Text variant="labelLarge">Testnet4</Text>
          </TouchableOpacity>
        </Section>

        <Section text="Address type">
          <TouchableOpacity
            onPress={() => nw.setType("p2pkh")}
            style={styles.radio}
          >
            <View style={{ pointerEvents: "none" }}>
              <RadioButton
                value={"p2pkh"}
                status={nw.type === "p2pkh" ? "checked" : "unchecked"}
              />
            </View>
            <Text variant="labelLarge" >p2pkh</Text>
            <Text variant="labelLarge" style={styles.label}>
              (legacy)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => nw.setType("p2wpkh")}
            style={styles.radio}
          >
            <View style={{ pointerEvents: "none" }}>
              <RadioButton
                value={"p2wpkh"}
                status={nw.type === "p2wpkh" ? "checked" : "unchecked"}
              />
            </View>
            <Text>p2wpkh</Text>
          </TouchableOpacity>
        </Section>

        <Section text="Wallet name (optional)">
          <TextInput
            mode="outlined"
            placeholder="Wallet name (optional)"
            autoCorrect={false}
            autoCapitalize={"none"}
            autoComplete={"off"}
            value={nw.name}
            onChangeText={(e) => nw.setName(e)}
            textAlignVertical="auto"
          />
        </Section>

        <View style={styles.buttonContainer}>
          <Button onPress={() => dismiss()} mode="text">
            Cancel
          </Button>
          <Button
            onPress={nw.nextStep}
            mode="contained"
            style={{ alignSelf: "flex-end" }}
          >
            Next
          </Button>
        </View>
      </View>

      <Animated.View style={{ height: keyboard.height }} />
    </ScrollView>
  );
}

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      gap: theme.sizes.m,
      padding: theme.sizes.m,
    },
    radio: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.sizes.s,
    },
    label: {
      color: theme.colors.onSurfaceVariant,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
