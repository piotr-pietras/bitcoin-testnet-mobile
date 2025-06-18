import { AppTheme, useTheme } from "@/services/theme";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

type Props = {
  text: string;
  rightCorner?: React.ReactNode;
};

export const Section = ({
  text,
  children,
  rightCorner,
}: PropsWithChildren<Props>) => {
  const theme = useTheme();
  const styles = stylesBuilder(theme);

  return (
    <Animated.View
      entering={FadeIn}
      layout={LinearTransition}
      style={styles.section}
    >
      <View style={styles.titleContainer}>
        <Text variant="titleSmall" style={styles.title}>
          {text}
        </Text>
        {rightCorner}
      </View>
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
    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
