import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthStack from "./navigation/AuthStack";

import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ NEW

import useNotificationHandler from "./services/notifications/notificationHandler";

// 🔥 DYNAMIC NOTIFICATION CONTROL (MAIN CHANGE)
Notifications.setNotificationHandler({
  handleNotification: async () => {
    try {
      const value = await AsyncStorage.getItem("notificationsEnabled");
      const enabled = JSON.parse(value || "true");

      // ❌ BLOCK NOTIFICATION
      if (!enabled) {
        return {
          shouldShowBanner: false,
          shouldShowList: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      }

      // ✅ ALLOW NOTIFICATION
      return {
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      };

    } catch {
      // fallback → allow
      return {
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      };
    }
  },
});

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  // 🔥 Notification logic hook
  useNotificationHandler();

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  if (!appReady) return null;

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