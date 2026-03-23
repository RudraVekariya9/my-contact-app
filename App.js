App.js


import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthStack from "./navigation/AuthStack";

import * as SplashScreen from "expo-splash-screen";

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