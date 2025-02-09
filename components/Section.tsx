import { AppTheme, useTheme } from "@/services/theme";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  text: string;
};

export const Section = ({ text, children }: PropsWithChildren<Props>) => {
  const theme = useTheme();
  const styles = stylesBuilder(theme);

  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.title}>{text}</Text>
      {children}
    </View>
  );
};

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    section: {
      padding: theme.sizes.m,
      borderRadius: theme.sizes.m,
      backgroundColor: theme.colors.surface,
      gap: theme.sizes.s
    },
    title: {
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.sizes.s,
    },
  });
