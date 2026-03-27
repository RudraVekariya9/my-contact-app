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
import { getAuth } from "firebase/auth";

import { Alert } from "react-native";
import { navigationRef, navigate } from "./navigation/utils/navigationRef";

//  IMPORT THIS (NEW)
import { saveNotification } from "./services/notifications/notificationStorage";

//  EXPO NOTIFICATION HANDLER
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Prevent splash auto hide
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  //  Splash
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

  //  Expo Permission
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

  //  FCM FOREGROUND
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const messagingInstance = getMessaging(getApp());

        await requestPermission(messagingInstance);

        onMessage(messagingInstance, async remoteMessage => {
          console.log(" Foreground message:", remoteMessage);

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

  //  FCM CLICK HANDLING
  useEffect(() => {
    const messagingInstance = getMessaging(getApp());

    const unsubscribe = onNotificationOpenedApp(
      messagingInstance,
      remoteMessage => {
        const todoId = remoteMessage?.data?.todoId;

        if (todoId) {
          navigate("TodoScreen", { todoId });
        }
      }
    );

    getInitialNotification(messagingInstance).then(remoteMessage => {
      if (remoteMessage) {
        const todoId = remoteMessage?.data?.todoId;

        if (todoId) {
          navigate("TodoScreen", { todoId });
        }
      }
    });

    return unsubscribe;
  }, []);

  //  NEW: SAVE WHEN NOTIFICATION ARRIVES
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        console.log(" Notification received → saving");

        const data = notification.request.content;

        await saveNotification({
          title: data.title,
          body: data.body,
          time: new Date().toISOString(),
        });
      }
    );

    return () => subscription.remove();
  }, []);

  //  EXPO CLICK HANDLING + AUTH CHECK
  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log(" Notification clicked");

          const data = response.notification.request.content.data;
          const user = getAuth().currentUser;

          if (user) {
            if (data?.todoId) {
              navigate("TodoScreen", { todoId: data.todoId });
            } else {
              navigate("Contacts");
            }
          } else {
            navigate("Login");
          }
        }
      );

    return () => subscription.remove();
  }, []);

  //  Splash wait
  if (!appReady) return null;

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