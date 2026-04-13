import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FavoriteScreen from "../screen/FavoriteScreen";
import HomeScreen from "../screen/HomeScreen";
import ContactDetails from "../screen/ContactDetails";
import NotificationScreen from "../screen/NotificationScreen";

import { ContactProvider } from "../context/ContactContext";
import VideoCallScreen from "../screen/VideoCallScreen";
import ChatScreen from "../screen/ChatScreen";

const Stack = createNativeStackNavigator();

export default function ContactsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ContactsList" component={HomeScreen} />
      <Stack.Screen name="ContactDetails" component={ContactDetails} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />

      <Stack.Screen name="VideoCall" component={VideoCallScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}