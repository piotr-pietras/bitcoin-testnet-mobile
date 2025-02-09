import { AppTheme, theme } from "@/services/theme";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

export type ButtonSectionItem = {
  text: string;
  iconName: keyof typeof Ionicons.glyphMap;
  right?: ReactNode;
  onPress?: () => void;
};

type Props = {
  buttons: ButtonSectionItem[];
};

export const ButtonSection = ({ buttons }: Props) => {
  const styles = stylesBuilder(theme);

  return (
    <View style={styles.buttonSection}>
      {buttons.map(({ iconName, text, onPress, right }, i) => {
        return (
          <TouchableOpacity key={i} onPress={onPress}>
            <View style={styles.buttonContainer}>
              <View style={styles.leftContainer}>
                <Ionicons name={iconName} size={theme.sizes.l} color={theme.colors.onSurface}/>
                <Text numberOfLines={1} variant="bodyLarge" style={styles.text}>
                  {text}
                </Text>
              </View>
              {right}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const stylesBuilder = (theme: AppTheme) =>
  StyleSheet.create({
    buttonSection: {
        backgroundColor: theme.colors.surface,
        paddingVertical: theme.sizes.m,
        paddingHorizontal: theme.sizes.l,
        borderColor: theme.colors.outline,
        borderRadius: theme.sizes.s,
      },
      buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      leftContainer: {
        paddingVertical: theme.sizes.m,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.sizes.m,
      },
      text: {
        flexShrink: 1,
        color: theme.colors.onSurface,
      },
  });
