import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, View } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { createUserProfile } from "../services/profileApi";

const AddressScreen = ({ navigation, route }) => {
  // Get data passed from SignupScreen
  const { username, email, password } = route.params;

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleGetLocation = async () => {
    setLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location access is required for auto-fill.");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      let response = await Location.reverseGeocodeAsync({ 
        latitude: location.coords.latitude, 
        longitude: location.coords.longitude 
      });

      if (response.length > 0) {
        const addr = response[0];
        setStreet(`${addr.name || ''} ${addr.street || ''}`.trim());
        setCity(addr.city || addr.district || '');
        setStateName(addr.region || '');
        setPincode(addr.postalCode || '');
      }
    } catch (error) {
      Alert.alert("Error", "Failed to get location.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleFinalSignup = async () => {
    if (!city || !pincode) {
      Alert.alert("Error", "Please provide at least City and Pincode");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const addressData = { street, city, state: stateName, pincode };
      
      await createUserProfile(userCredential.user, username, email, addressData);

      Alert.alert("Success", "Account created successfully!");
      navigation.replace("App");
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#e6f2ff", paddingVertical: 40 }}>
        <Container>
          <Card>
            <Title>Address Details</Title>
            <Subtitle>Step 2 of 2: Location</Subtitle>

            <LocationButton onPress={handleGetLocation} disabled={loadingLocation}>
              {loadingLocation ? (
                <ActivityIndicator color="#0b74e5" />
              ) : (
                <>
                  <Ionicons name="location" size={18} color="#0b74e5" />
                  <LocationButtonText>Auto-detect Location</LocationButtonText>
                </>
              )}
            </LocationButton>

            <Label>Street / Area</Label>
            <Input value={street} onChangeText={setStreet} placeholder="Apartment, Road name" />

            <Row>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Label>City</Label>
                <Input value={city} onChangeText={setCity} />
              </View>
              <View style={{ flex: 1 }}>
                <Label>Pincode</Label>
                <Input value={pincode} onChangeText={setPincode} keyboardType="numeric" />
              </View>
            </Row>

            <Label>State</Label>
            <Input value={stateName} onChangeText={setStateName} />

            <Button onPress={handleFinalSignup}>
              <ButtonText>Complete Sign Up</ButtonText>
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

export default AddressScreen;


const Container = styled.View`
  padding: 20px;
`;

const Card = styled.View`
  background-color: #fff;
  border-radius: 20px;
  padding: 24px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #0b74e5;
  text-align: center;
`;

const Subtitle = styled.Text`
  text-align: center;
  color: #666;
  margin-bottom: 20px;
`;

const LocationButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 1.5px dashed #0b74e5;
  border-radius: 10px;
  background-color: #f0f7ff;
  margin-bottom: 10px;
`;

const LocationButtonText = styled.Text`
  color: #0b74e5;
  font-weight: bold;
  margin-left: 10px;
`;

const Label = styled.Text`
  margin-top: 15px;
  color: #0b74e5;
  font-weight: 600;
`;

/* Input with your chosen placeholder color #a6b8d1 */
const Input = styled.TextInput.attrs({
  placeholderTextColor: '#a6b8d1',
})`
  border: 1px solid #0b74e5;
  padding: 10px;
  border-radius: 8px;
  background-color: #f2f8ff;
  margin-top: 5px;
  color: #333;
`;

const Row = styled.View`
  flex-direction: row;
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