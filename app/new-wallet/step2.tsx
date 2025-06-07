import { Section } from "@/components/Section";
import { useNewWalletContext } from "@/context/NewWalletContext";
import { AppTheme, useTheme } from "@/services/theme";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function Step2Screen() {
  const theme = useTheme();
  const styles = stylesBuilder(theme);
  const nw = useNewWalletContext();
  const { dismiss } = useRouter();

  const onGenerate = () => {
    nw?.generateNewWallet().then(() => {
      dismiss();
    });
  };

  return (
    <View style={styles.container}>
      <Section text="Key words">
        <TextInput
          mode="outlined"
          placeholder="here type some key words to generate private key"
          autoCorrect={false}
          autoCapitalize={"none"}
          autoComplete={"off"}
          value={nw?.phrase}
          onChangeText={(e) => nw?.setPhrase(e)}
          textAlignVertical="auto"
          multiline
          numberOfLines={10}
        />
      </Section>

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
  });
