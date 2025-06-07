import { PropsWithChildren, useCallback } from "react";
import { GestureResponderEvent, Pressable, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const PressInteractive = ({ children }: PropsWithChildren<any>) => {
  const scale = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = useCallback(
    (
      e: GestureResponderEvent,
      targetValue: number,
      handler?: (e: GestureResponderEvent) => void
    ) => {
      "worklet";
      // if (handler) {
      //   runOnJS(handler)(e);
      // }
      cancelAnimation(scale);
      scale.value = withTiming(targetValue, { duration: 100 });
    },
    [scale]
  );

  return (
    <AnimatedPressable
      onPressIn={(e) => handlePress(e, 0.9)}
      onPressOut={(e) => handlePress(e, 1)}
      style={animatedStyles}
      accessibilityRole="button"
    >
      {children}
    </AnimatedPressable>
  );
};
