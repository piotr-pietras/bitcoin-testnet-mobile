import { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { Icon, IconButton as PaperIconButton } from "react-native-paper";
import { Props as PaperIconButtonProps } from "react-native-paper/lib/typescript/components/IconButton/IconButton";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props extends PaperIconButtonProps {
  rotate?: boolean;
}

const AnimatedPaperIconButton =
  Animated.createAnimatedComponent(PaperIconButton);

export default function IconButton(props: Props) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = useCallback(
    (targetScale: number, targetOpacity: number) => {
      "worklet";
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = withTiming(targetScale, { duration: 100 });
      opacity.value = withTiming(targetOpacity, { duration: 100 });
    },
    [scale]
  );

  const handlePressOut = useCallback(
    (targetScale: number, targetOpacity: number) => {
      "worklet";
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = withTiming(targetScale, { duration: 100 });
      opacity.value = withTiming(targetOpacity, { duration: 100 });
      rotate.value = withTiming(props.rotate ? rotate.value + 360 : 0, {
        duration: 500,
      });
    },
    [scale]
  );

  return (
    <AnimatedPaperIconButton
      {...props}
      onPressIn={(e) => handlePressIn(0.9, 0.66)}
      onPressOut={(e) => handlePressOut(1, 1)}
      style={[props.style, !reducedMotion && animatedStyles]}
    />
  );
}
