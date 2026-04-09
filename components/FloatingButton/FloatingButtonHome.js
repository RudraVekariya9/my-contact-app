import React, { useContext } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from "react-native-reanimated";

import { PanGestureHandler } from "react-native-gesture-handler";

import { FloatingButtonContext } from "../../context/FloatingButtonContext";

export default function FloatingButtonHome() {
  const { enabled } = useContext(FloatingButtonContext);

  const posX = useSharedValue(0);
  const posY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  // 🔹 Drag
  const onGestureEvent = (event) => {
    translateX.value = event.nativeEvent.translationX;
    translateY.value = event.nativeEvent.translationY;
  };

  const onEnd = () => {
    posX.value += translateX.value;
    posY.value += translateY.value;

    translateX.value = 0;
    translateY.value = 0;
  };

  // 🔹 Animation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: posX.value + translateX.value },
      { translateY: posY.value + translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  // 🔹 Spin on tap
  const handlePress = () => {
    rotation.value = 0;

    rotation.value = withRepeat(
      withTiming(360, { duration: 500 }),
      4,
      false
    );

    setTimeout(() => {
      rotation.value = 0;
    }, 2000);
  };

  // 🔥 CONTROL VISIBILITY
  if (!enabled) return null;

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onEnd}>
      <AnimatedButton style={animatedStyle}>
        <ButtonTouchable onPress={handlePress}>
          <Ionicons name="settings" size={24} color="#fff" />
        </ButtonTouchable>
      </AnimatedButton>
    </PanGestureHandler>
  );
}

/* styles */

const AnimatedButton = styled(Animated.View)`
  position: absolute;
  bottom: 100px;
  right: 20px;
  z-index: 999;
`;

const ButtonTouchable = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #0b74e5;
  justify-content: center;
  align-items: center;
  elevation: 10;
`;