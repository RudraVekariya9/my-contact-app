import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import StepIndicator from "../components/StepIndicator";


import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  
  

  
  const [request, response, promptAsync] = Google.useAuthRequest({
  // Provide the Android ID to stop the "must be defined" error
  androidClientId: "493529142252-m8m83hqc9n3n2bo0rinc49sb2et2ppil.apps.googleusercontent.com",
  
  // Provide the Web IDs for the actual login flow
  expoClientId: "493529142252-srb3cdh4at5bla9o51dqge7g745g9jen.apps.googleusercontent.com",
  webClientId: "493529142252-srb3cdh4at5bla9o51dqge7g745g9jen.apps.googleusercontent.com",
  
  // ADD THIS LINE: This tells the hook exactly where to return
  redirectUri: AuthSession.makeRedirectUri({
    useProxy: true,
  }),
});

  
  useEffect(() => {
  if (response?.type === "success") {
    const { authentication } = response;
    // This gives you the token to fetch user details
    getUserInfo(authentication.accessToken);
  } else if (response?.type === "error") {
    Alert.alert("Login Failed", "Something went wrong with Google Sign-in");
  }
}, [response]);

    const getUserInfo = async (token) => {
    try {
      const res = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await res.json();

      console.log("Google User:", user);

      // Navigate to next screen
      navigation.navigate("BirthdayScreen", {
        username: user.name,
        email: user.email,
        isGoogleUser: true,
      });
    } catch (error) {
      console.log("User fetch error:", error);
    }
  };

  
  const handleNext = () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all credentials");
      return;
    }

    navigation.navigate("BirthdayScreen", {
      username,
      email,
      password,
      isGoogleUser: false,
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

            
            <GoogleButton 
  disabled={!request} 
  onPress={() => {
    promptAsync({ 
      useProxy: true 
    });
  }}
>
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <GoogleText>Continue with Google</GoogleText>
            </GoogleButton>
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
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #0b74e5;
  text-align: center;
`;

const Subtitle = styled.Text`
  text-align: center;
  color: #666;
  margin-bottom: 20px;
`;

const Label = styled.Text`
  margin-top: 15px;
  color: #0b74e5;
  font-weight: 600;
`;

const Input = styled.TextInput`
  border: 1px solid #0b74e5;
  padding: 12px;
  border-radius: 10px;
  margin-top: 5px;
`;

const PasswordContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid #0b74e5;
  border-radius: 10px;
  margin-top: 5px;
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
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin-top: 30px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

const GoogleButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
`;

const GoogleText = styled.Text`
  margin-left: 10px;
  font-weight: 600;
`;