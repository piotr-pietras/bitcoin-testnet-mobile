import { Section } from "@/components/Section";
import { useNewWalletContext } from "@/context/NewWalletContext";
import { AppTheme, useTheme } from "@/services/theme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, SegmentedButtons, TextInput, Text } from "react-native-paper";
import Animated, { useAnimatedKeyboard } from "react-native-reanimated";
import Clipboard from "@react-native-clipboard/clipboard";

export default function Step2Screen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const nw = useNewWalletContext();
  const keyboard = useAnimatedKeyboard();
  const { replace } = useRouter();

  const onGenerate = () => {
    nw.generateNewWallet().then(() => {
      replace(`/(tabs)?testnet=${nw.net}`);
    });
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <SegmentedButtons
          value={nw.seedType}
          onValueChange={(v) => nw.setSeedType(v as "keywords" | "privetKey")}
          buttons={[
            {
              value: "keywords",
              label: "Key words",
            },
            {
              value: "privetKey",
              label: "Private key",
            },
          ]}
        />
        {nw.seedType === "keywords" && (
          <Section text="Key words">
            <TextInput
              style={styles.keywordsContainer}
              mode="outlined"
              placeholder="Type some key words which are going to be used to generate private key"
              autoCorrect={false}
              autoCapitalize={"none"}
              autoComplete={"off"}
              value={nw.phrase}
              onChangeText={(e) => nw.setPhrase(e)}
              textAlignVertical="auto"
              multiline
              numberOfLines={10}
            />
          </Section>
        )}

        {nw.seedType === "privetKey" && (
          <Section text="Private key">
            <Text style={styles.label} variant="labelMedium">
              Private key must be 64 characters long hex string.
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Paste your private key"
              autoCorrect={false}
              autoCapitalize={"none"}
              autoComplete={"off"}
              value={nw.privetKey}
              onChangeText={(e) => nw.setPrivetKey(e)}
              right={
                <TextInput.Icon
                  icon="clipboard"
                  onPress={() => Clipboard.getString().then((text) => {
                    if (text) nw.setPrivetKey(text);
                  })}
                />
              }
            />
          </Section>
        )}

        <View style={styles.buttonContainer}>
          <Button onPress={nw.previousStep} mode="text">
            Back
          </Button>
          <Button
            onPress={onGenerate}
            disabled={!nw.allowGenerate}
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
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    wordsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.sizes.s,
    },
    chip: {
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: theme.sizes.s,
      paddingVertical: theme.sizes.s,
      borderRadius: theme.sizes.s,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
    },
    word: {
      color: theme.colors.primary,
      fontWeight: "bold",
    },
    keywordsContainer: {
      minHeight: 200,
    },
    label: {
      color: theme.colors.secondary,
    },
  });
