import { AppTheme, useTheme } from "@/services/theme";
import { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import Animated, { LinearTransition } from "react-native-reanimated";

type Props = {
  text: string;
};

export const Section = ({ text, children }: PropsWithChildren<Props>) => {
  const theme = useTheme();
  const styles = stylesBuilder(theme);

  return (
    <Animated.View layout={LinearTransition} style={styles.section}>
      <Text variant="titleSmall" style={styles.title}>
        {text}
      </Text>
      {children}
    </Animated.View>
  );
};

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    section: {
      padding: theme.sizes.m,
      borderRadius: theme.sizes.m,
      backgroundColor: theme.colors.surface,
      gap: theme.sizes.s,
    },
    title: {
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.sizes.s,
    },
  });
