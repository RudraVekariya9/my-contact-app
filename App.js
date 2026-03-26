import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthStack from "./navigation/AuthStack";

import * as SplashScreen from "expo-splash-screen";


// 🔥 ADD THESE
import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";

// Prevent splash from auto hiding
SplashScreen.preventAutoHideAsync();

export default function App() {

  const [appReady, setAppReady] = useState(false);

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

  // 🔥 ADD THIS NEW useEffect (FCM FOREGROUND)
  useEffect(() => {
  const setupFCM = async () => {
    try {
      await messaging().requestPermission();

      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log("📩 Foreground message:", JSON.stringify(remoteMessage));

        if (remoteMessage?.notification) {
          Alert.alert(
            remoteMessage.notification.title || "Notification",
            remoteMessage.notification.body || "You have a new message"
          );
        } else {
          Alert.alert("Notification", "Message received");
        }
      });

      return unsubscribe;
    } catch (error) {
      console.log("FCM Error:", error);
    }
  };

  setupFCM();
}, []);

  // While splash is showing
  if (!appReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}