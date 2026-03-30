import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import ContactsStack from "./ContactsStack";
import ProfileStack from "./ProfileStack";
import FavoriteScreen from "../screen/FavoriteScreen";

import { ContactProvider } from "../context/ContactContext";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <ContactProvider> 
      <Tab.Navigator
        initialRouteName="Contacts"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Contacts") {
              iconName = focused ? "people" : "people-outline";
            } else if (route.name === "Favorite") {
              iconName = focused ? "heart" : "heart-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#0b74e5",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Favorite"
          component={FavoriteScreen}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="Contacts"
          component={ContactsStack}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </ContactProvider>
  );
}