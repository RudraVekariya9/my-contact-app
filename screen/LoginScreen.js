import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getFCMToken } from "../services/fcmService";

import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const LoginScreen = ({ navigation }) => {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("LOGIN SUCCESS");

      const token = await getFCMToken();
      const user = userCredential.user;

      if (token && user) {
        await setDoc(
          doc(db, "users", user.uid),
          { fcmToken: token },
          { merge: true }
        );

        console.log("TOKEN SAVED");
      }

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
          backgroundColor: "#e6f2ff",
        }}
      >
        <Container>
          <Card>
            <Title>Login</Title>

            {/* ORIGINAL STATIC TEXT */}
            <Subtitle>Hello</Subtitle>

            <Label>Email</Label>
            <Input
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Label>Password</Label>
            <PasswordContainer>
              <PasswordInput
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <EyeButton onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#0b74e5"
                />
              </EyeButton>
            </PasswordContainer>

            <LoginButton onPress={handleLogin}>
              <LoginText>Login</LoginText>
            </LoginButton>

            <SwitchText onPress={() => navigation.navigate("Signup")}>
              Create new account
            </SwitchText>
          </Card>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

/* styles */

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
  margin-bottom: 10px;
  font-weight: bold;
  color: #0b74e5;
`;

const Subtitle = styled.Text`
  text-align: center;
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
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
  color: black;
`;

const EyeButton = styled.TouchableOpacity`
  padding: 10px;
`;

const LoginButton = styled.TouchableOpacity`
  background-color: #0b74e5;
  padding: 14px;
  border-radius: 10px;
  align-items: center;
  margin-top: 25px;
`;

const LoginText = styled.Text`
  color: white;
  font-weight: bold;
`;

const SwitchText = styled.Text`
  text-align: center;
  margin-top: 15px;
  color: #0b74e5;
`;