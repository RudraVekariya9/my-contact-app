import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FavoriteScreen from "../screen/FavoriteScreen";
import HomeScreen from "../screen/HomeScreen";
import ContactDetails from "../screen/ContactDetails";
import { ContactProvider } from "../context/ContactContext"; 

const Stack = createNativeStackNavigator();

export default function ContactsStack({ navigation }) {
  return (

    <ContactProvider> 

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >

        <Stack.Screen
          name="ContactsList"
          component={HomeScreen}
        />

        <Stack.Screen
          name="ContactDetails"
          component={ContactDetails}
        />

        <Stack.Screen
          name="FavoriteScreen"
          component={FavoriteScreen}
        />

      </Stack.Navigator>

    </ContactProvider>

  );
}