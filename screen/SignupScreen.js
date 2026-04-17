import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import StepIndicator from "../components/StepIndicator";

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  

  const handleNext = () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all credentials");
      return;
    }

    // ✅ CHANGED: Navigate to BirthdayScreen instead of AddressScreen
    navigation.navigate("BirthdayScreen", {
      username,
      email,
      password,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#e6f2ff",
          justifyContent: "center",
        }}
      >
        <Container>
          <Card>
            <StepIndicator currentStep={1} />
            <Title>Create Account</Title>
            <Subtitle>Step 1 of 3: Basic Info</Subtitle>

            <Label>Username</Label>
            <Input
              value={username}
              onChangeText={setUsername}
              placeholder="Choose a username"
            />

            <Label>Email</Label>
            <Input
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="example@email.com"
            />

            <Label>Password</Label>
            <PasswordContainer>
              <PasswordInput
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholder="Min 6 characters"
              />
              <EyeButton onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#0b74e5"
                />
              </EyeButton>
            </PasswordContainer>

            <Button onPress={handleNext}>
              <ButtonText>Next: Birthdate</ButtonText>
            </Button>
          </Card>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

/* STYLES */

const Container = styled.View`
  padding: 20px;
`;

const Card = styled.View`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 24px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #0b74e5;
  text-align: center;
`;

const Subtitle = styled.Text`
  text-align: center;
  color: #666666;
  margin-top: 5px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const Label = styled.Text`
  margin-top: 15px;
  color: #0b74e5;
  font-weight: 600;
  font-size: 13px;
`;

const Input = styled.TextInput.attrs({
  placeholderTextColor: "#a6b8d1",
})`
  border: 1px solid #0b74e5;
  padding: 12px;
  border-radius: 10px;
  background-color: #f2f8ff;
  margin-top: 5px;
  color: #0f172a;
  font-size: 15px;
`;

const PasswordContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid #0b74e5;
  border-radius: 10px;
  background-color: #f2f8ff;
  margin-top: 5px;
`;

const PasswordInput = styled.TextInput.attrs({
  placeholderTextColor: "#a6b8d1",
})`
  flex: 1;
  padding: 12px;
  color: #0f172a;
  font-size: 15px;
`;

const EyeButton = styled.TouchableOpacity`
  padding: 10px;
`;

const Button = styled.TouchableOpacity`
  background-color: #0b74e5;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin-top: 30px;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-weight: bold;
  font-size: 16px;
`;