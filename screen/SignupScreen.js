import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { createUserProfile } from "../services/profileApi";

const SignupScreen = ({ navigation }) => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
  try {
    if (!username || !email || !password) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await createUserProfile(user, username, email);

    Alert.alert("Success", "Account created!");
    navigation.replace("App");

  } catch (error) {
    alert(error.message);
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          backgroundColor: "#e6f2ff"
        }}
      >
        <Container>
          <Card>

            <Title>Sign Up</Title>

            <Label>Username</Label>
            <Input value={username} onChangeText={setUsername} />

            <Label>Email</Label>
            <Input value={email} onChangeText={setEmail} />

            <Label>Password</Label>
            <PasswordContainer>
              <PasswordInput
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <EyeButton onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#0b74e5" />
              </EyeButton>
            </PasswordContainer>

            <Button onPress={handleSignup}>
              <ButtonText>Sign Up</ButtonText>
            </Button>

          </Card>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;


/* styles (same as login) */

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: #e6f2ff;
`;

const Card = styled.View`
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  elevation: 5;
`;

const Title = styled.Text`
  font-size: 28px;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
  color: #0b74e5;
`;

const Label = styled.Text`
  margin-top: 15px;
  color: #0b74e5;
`;

const Input = styled.TextInput`
  border: 1px solid #0b74e5;
  padding: 12px;
  border-radius: 8px;
  background-color: #f2f8ff;
`;

const PasswordContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid #0b74e5;
  border-radius: 8px;
  background-color: #f2f8ff;
`;

const PasswordInput = styled.TextInput`
  flex: 1;
  padding: 12px;
`;

const EyeButton = styled.TouchableOpacity`
  padding: 10px;
`;

const Button = styled.TouchableOpacity`
  background-color: #0b74e5;
  padding: 14px;
  border-radius: 10px;
  align-items: center;
  margin-top: 25px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;