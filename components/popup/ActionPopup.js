import React, { useRef, useEffect } from "react";
import { Modal, Animated } from "react-native";
import styled from "styled-components/native";

const ActionPopup = ({
  visible,
  message,
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText
}) => {

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {

    if (visible) {

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true
        })
      ]).start();

    }

  }, [visible]);

  const handleClose = () => {

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(onClose);

  };

  return (
    <Modal transparent visible={visible} animationType="none">

      <Overlay>

        <AnimatedBox
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }}
        >

          <Message>{String(message || "")}</Message>

          <ButtonRow>

            {cancelText ? (
              <CancelButton onPress={handleClose}>
                <CancelText>{String(cancelText)}</CancelText>
              </CancelButton>
            ) : null}

            <OkButton onPress={onConfirm || handleClose}>
              <OkText>{String(confirmText)}</OkText>
            </OkButton>

          </ButtonRow>

        </AnimatedBox>

      </Overlay>

    </Modal>
  );
};

export default ActionPopup;


/* styles */

const Overlay = styled.View`
  flex:1;
  justify-content:center;
  align-items:center;
  background-color:rgba(0,0,0,0.4);
`;

const AnimatedBox = styled(Animated.View)`
  background:white;
  padding:25px;
  border-radius:12px;
  width:260px;
  align-items:center;
`;

const Message = styled.Text`
  font-size:16px;
  text-align:center;
  margin-bottom:20px;
`;

const ButtonRow = styled.View`
  flex-direction:row;
  justify-content:center;
  width:100%;
`;

const CancelButton = styled.TouchableOpacity`
  background:#ccc;
  padding:10px 25px;
  border-radius:8px;
  margin-right:10px;
`;

const CancelText = styled.Text`
  font-weight:bold;
`;

const OkButton = styled.TouchableOpacity`
  background:#0b74e5;
  padding:10px 25px;
  border-radius:8px;
`;

const OkText = styled.Text`
  color:white;
  font-weight:bold;
`;