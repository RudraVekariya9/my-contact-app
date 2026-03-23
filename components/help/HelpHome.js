import React, { useState } from "react";
import styled from "styled-components/native";
import { Alert } from "react-native";

export default function HelpHome() {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim() === "") {
      Alert.alert("Error", "Please describe your issue before submitting.");
      return;
    }

    Alert.alert("Submitted", "Your issue has been sent successfully!");
    setMessage("");
  };

  return (
    <Container>
      <Label>Describe your issue</Label>

      <TextArea
        placeholder="Type your message here..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={5}
        value={message}
        onChangeText={setMessage}
      />

      <SubmitButton onPress={handleSubmit}>
        <ButtonText>Submit</ButtonText>
      </SubmitButton>
    </Container>
  );
}

const Container = styled.View`
  padding: 20px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const TextArea = styled.TextInput`
  height: 160px;
  border-width: 1px;
  border-color: #ddd;
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  background-color: #ffffff;
  text-align-vertical: top;
`;

const SubmitButton = styled.TouchableOpacity`
  margin-top: 20px;
  background-color: #007bff;
  padding: 14px;
  border-radius: 10px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;