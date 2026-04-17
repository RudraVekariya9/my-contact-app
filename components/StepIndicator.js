import React, { useEffect, useRef } from "react";
import styled from "styled-components/native";
import { Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const StepIndicator = ({ currentStep }) => {
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const scale3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    animate(scale1, currentStep === 1);
    animate(scale2, currentStep === 2);
    animate(scale3, currentStep === 3);
  }, [currentStep]);

  const animate = (scale, active) => {
    Animated.spring(scale, {
      toValue: active ? 1.3 : 1,
      useNativeDriver: true,
    }).start();
  };

  const renderContent = (step, icon) => {
    if (currentStep > step) {
      return <Ionicons name="checkmark" size={14} color="white" />; //  completed
    }
    if (currentStep === step) {
      return <Ionicons name={icon} size={14} color="white" />; //  current
    }
    return null; 
  };

  return (
    <Container>
      {/* STEP 1 */}
      <DotWrapper>
        <AnimatedDot style={{ transform: [{ scale: scale1 }] }} active={currentStep >= 1}>
          {renderContent(1, "person")}
        </AnimatedDot>
      </DotWrapper>

      {/* STEP 2 */}
      <DotWrapper>
        <AnimatedDot style={{ transform: [{ scale: scale2 }] }} active={currentStep >= 2}>
          {renderContent(2, "calendar")}
        </AnimatedDot>
      </DotWrapper>

      {/* STEP 3 */}
      <DotWrapper>
        <AnimatedDot style={{ transform: [{ scale: scale3 }] }} active={currentStep >= 3}>
          {renderContent(3, "location")}
        </AnimatedDot>
      </DotWrapper>
    </Container>
  );
};

export default StepIndicator;

/* STYLES */

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const DotWrapper = styled.View`
  height: 32px;
  justify-content: center;
  align-items: center;
  margin: 0 6px;
`;

const AnimatedDot = styled(Animated.View)`
  width: ${(props) => (props.active ? "32px" : "12px")};
  height: ${(props) => (props.active ? "32px" : "12px")};
  border-radius: 16px;
  background-color: ${(props) => (props.active ? "#0b74e5" : "#cbd5e1")};
  align-items: center;
  justify-content: center;
`;