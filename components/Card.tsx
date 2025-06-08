import { useCallback } from "react";
import { Card as PaperCard } from "react-native-paper";
import { GestureResponderEvent, TouchableOpacity } from "react-native";
import { Props as PaperCardProps } from "react-native-paper/lib/typescript/components/Card/Card";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props extends PaperCardProps {
  rotate?: boolean;
}

const AnimatedPaperCard = Animated.createAnimatedComponent(PaperCard);

export default function Card(props: Props) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePress = useCallback(
    (targetScale: number, targetOpacity: number) => {
      "worklet";
      cancelAnimation(scale);
      scale.value = withTiming(targetScale, { duration: 100 });
      opacity.value = withTiming(targetOpacity, { duration: 100 });
    },
    [scale]
  );

  return (
    <AnimatedPaperCard
      {...props}
      elevation={0}
      onPressIn={(e) => handlePress(0.9, 0.66)}
      onPressOut={(e) => handlePress(1, 1)}
      style={[props.style, !reducedMotion && animatedStyles]}
    />
  );
}
