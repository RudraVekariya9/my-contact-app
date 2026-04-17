import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import StepIndicator from "../components/StepIndicator";

const BirthdayScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { username, email, password } = route.params;

  const [birthdate, setBirthdate] = useState("");

  // ✅ Auto format while typing
  const handleChange = (text) => {
    let cleaned = text.replace(/\D/g, ""); // remove non-numbers

    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    let formatted = cleaned;

    if (cleaned.length > 4) {
      formatted = cleaned.slice(0, 4) + "-" + cleaned.slice(4);
    }
    if (cleaned.length > 6) {
      formatted =
        cleaned.slice(0, 4) +
        "-" +
        cleaned.slice(4, 6) +
        "-" +
        cleaned.slice(6);
    }

    setBirthdate(formatted);
  };

  // ✅ Validation
  const isValidDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  };

  const handleNext = () => {
    if (!birthdate) {
      Alert.alert("Error", "Please enter your birthdate");
      return;
    }

    if (!isValidDate(birthdate)) {
      Alert.alert("Error", "Format should be YYYY-MM-DD");
      return;
    }

    navigation.navigate("AddressScreen", {
      username,
      email,
      password,
      birthdate,
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
            <StepIndicator currentStep={2} />
            <Title>Birthday Details</Title>
            <Subtitle>Step 2 of 3</Subtitle>

            <Label>Birthdate</Label>

            <Input
              placeholder="YYYY-MM-DD"
              value={birthdate}
              onChangeText={handleChange}
              keyboardType="numeric"
              maxLength={10}
            />

            <Hint>Example: 2003-05-21</Hint>

            <Button onPress={handleNext}>
              <ButtonText>Next: Address</ButtonText>
            </Button>

            <BackButton onPress={() => navigation.goBack()}>
              <BackButtonText>Go Back</BackButtonText>
            </BackButton>
          </Card>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BirthdayScreen;

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

const Input = styled.TextInput.attrs({
  placeholderTextColor: "#a6b8d1",
})`
  border: 1px solid #0b74e5;
  padding: 12px;
  border-radius: 10px;
  background-color: #f2f8ff;
  margin-top: 5px;
  color: #0f172a;
`;

const Hint = styled.Text`
  font-size: 12px;
  color: #888;
  margin-top: 5px;
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

const BackButton = styled.TouchableOpacity`
  margin-top: 20px;
  align-items: center;
`;

const BackButtonText = styled.Text`
  color: #888;
  text-decoration: underline;
`;