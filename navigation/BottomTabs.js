import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import ContactsStack from "./ContactsStack";
import ProfileStack from "./ProfileStack";
import NotificationScreen from "../screen/NotificationScreen";
import { getUnreadCount } from "../services/notifications/notificationStorage";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const [unread, setUnread] = useState(0);

  
  useEffect(() => {
    const loadUnread = async () => {
      const count = await getUnreadCount();
      setUnread(count);
    };

    loadUnread();

    //  Auto refresh every second
    const interval = setInterval(loadUnread, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Contacts"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Contacts") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Notifications") {
            iconName = focused
              ? "notifications"
              : "notifications-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0b74e5",
        tabBarInactiveTintColor: "gray",
      })}
    >
      {/*  Notifications */}
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          headerShown: false,
          tabBarBadge: unread > 0 ? unread : null, //  badge
        }}
      />

      {/*  Contacts */}
      <Tab.Screen
        name="Contacts"
        component={ContactsStack}
        options={{ headerShown: false }}
      />

      {/* 👤 Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}