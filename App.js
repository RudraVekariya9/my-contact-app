import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthStack from "./navigation/AuthStack";

import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import {
  getMessaging,
  onMessage,
  requestPermission,
  onNotificationOpenedApp,
  getInitialNotification
} from "@react-native-firebase/messaging";

import { getApp } from "@react-native-firebase/app";
import { Alert } from "react-native";

import { navigationRef, navigate } from "./navigationRef";

// 🔔 EXPO NOTIFICATION HANDLER
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Prevent splash from auto hiding
SplashScreen.preventAutoHideAsync();

export default function App() {

  const [appReady, setAppReady] = useState(false);

  // 🟡 Splash handling
  useEffect(() => {
    const prepareApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.log(e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  // 🔔 EXPO NOTIFICATION PERMISSION
  useEffect(() => {
    const requestExpoPermission = async () => {
      if (Device.isDevice) {
        const { status } = await Notifications.requestPermissionsAsync();

        if (status !== "granted") {
          console.log("❌ Expo notification permission denied");
        }
      }
    };

    requestExpoPermission();
  }, []);

  // 🔔 FCM FOREGROUND NOTIFICATIONS
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const messagingInstance = getMessaging(getApp());

        await requestPermission(messagingInstance);

        onMessage(messagingInstance, async remoteMessage => {
          console.log("📩 Foreground message:", remoteMessage);

          if (remoteMessage?.notification) {
            Alert.alert(
              remoteMessage.notification.title,
              remoteMessage.notification.body
            );
          }
        });

      } catch (error) {
        console.log("FCM Error:", error);
      }
    };

    setupFCM();
  }, []);

  // 🔔 FCM NOTIFICATION CLICK HANDLING
  useEffect(() => {
    const messagingInstance = getMessaging(getApp());

    // App in background
    const unsubscribe = onNotificationOpenedApp(
      messagingInstance,
      remoteMessage => {
        console.log("🔔 Notification clicked (background):", remoteMessage);

        const todoId = remoteMessage?.data?.todoId;

        if (todoId) {
          navigate("TodoScreen", { todoId });
        }
      }
    );

    // App closed
    getInitialNotification(messagingInstance).then(remoteMessage => {
      if (remoteMessage) {
        console.log("🚀 Opened from quit state:", remoteMessage);

        const todoId = remoteMessage?.data?.todoId;

        if (todoId) {
          navigate("TodoScreen", { todoId });
        }
      }
    });

    return unsubscribe;
  }, []);

  // 🟡 Splash screen
  if (!appReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <AuthStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}