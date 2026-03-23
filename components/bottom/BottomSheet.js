import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  PanResponder,
  Dimensions,
  Keyboard
} from "react-native";
import styled from "styled-components/native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const BottomSheet = ({ visible, children, closeSheet }) => {

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {

    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };

  }, []);

  useEffect(() => {

    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true
      }).start();
    }

  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return gesture.dy > 10;
      },

      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {

          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true
          }).start(closeSheet);

        } else {

          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true
          }).start();

        }
      }
    })
  ).current;

  if (!visible) return null;

  return (
    <Overlay>

      <AnimatedSheet
        style={{
          transform: [{ translateY }],
          marginBottom: keyboardHeight
        }}
        {...panResponder.panHandlers}
      >

        <HandleBar />

        {children}

      </AnimatedSheet>

    </Overlay>
  );
};

export default BottomSheet;


/* styles */

const Overlay = styled.View`
  position:absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  background-color:rgba(0,0,0,0.3);
  justify-content:flex-end;
`;

const AnimatedSheet = styled(Animated.View)`
  background-color:white;
  padding:20px;
  border-top-left-radius:20px;
  border-top-right-radius:20px;
`;

const HandleBar = styled.View`
  width:40px;
  height:5px;
  background-color:#ccc;
  border-radius:5px;
  align-self:center;
  margin-bottom:10px;
`;