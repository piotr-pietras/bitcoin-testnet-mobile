import { Section } from "@/components/Section";
import { useNewWalletContext } from "@/context/NewWalletContext";
import { AppTheme, useTheme } from "@/services/theme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Animated, {
  LinearTransition,
  SlideInRight,
  SlideOutRight,
  useAnimatedKeyboard,
} from "react-native-reanimated";

export default function Step2Screen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const nw = useNewWalletContext();
  const keyboard = useAnimatedKeyboard();
  const { replace } = useRouter();

  const onGenerate = () => {
    nw?.generateNewWallet().then(() => {
      replace(`/(tabs)?testnet=${nw?.net}`);
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Section text="Key words">
          <TextInput
            mode="outlined"
            placeholder="Type some key words to that are going to be used to generate private key"
            autoCorrect={false}
            autoCapitalize={"none"}
            autoComplete={"off"}
            value={nw?.phrase}
            onChangeText={(e) => {
              nw?.setPhrase(
                e
                  .replace(/[^a-zA-Z0-9\s]/g, "") // Keep only letters, numbers, and spaces
                  .replace(/^ /, "") // Remove first space at the beginning
                  .replace(/\s+/g, " ") // Replace multiple spaces with single space
              );
            }}
            textAlignVertical="auto"
            multiline
            numberOfLines={10}
          />
        </Section>
        <View style={styles.wordsContainer}>
          {nw?.phrase?.length ?? 0 > 0
            ? nw?.phrase.split(" ").map((word, index) => {
                return (
                  <Animated.View
                    layout={LinearTransition}
                    key={index}
                    entering={SlideInRight}
                    exiting={SlideOutRight}
                    style={styles.chip}
                  >
                    <Text variant="bodyMedium" style={styles.word}>
                      {word}
                    </Text>
                  </Animated.View>
                );
              })
            : null}
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={nw?.previousStep} mode="text">
            Back
          </Button>
          <Button
            onPress={onGenerate}
            disabled={!nw?.allowGenerate}
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
  });
