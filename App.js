import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity, Linking, Dimensions } from "react-native";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthStack from "./navigation/AuthStack";

import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FloatingButtonProvider } from "./context/FloatingButtonContext";

import useNotificationHandler from "./services/notifications/notificationHandler";

// --- FORCE UPDATE NECESSITIES ---
import DeviceInfo from "react-native-device-info";
import firestore from "@react-native-firebase/firestore";
const { width } = Dimensions.get("window");
// --------------------------------

Notifications.setNotificationHandler({
  handleNotification: async () => {
    try {
      const value = await AsyncStorage.getItem("notificationsEnabled");
      const enabled = JSON.parse(value || "true");

      if (!enabled) {
        return {
          shouldShowBanner: false,
          shouldShowList: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      }

      return {
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      };
    } catch {
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

  // --- FORCE UPDATE STATE ---
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [updateData, setUpdateData] = useState({ version: "", message: "", url: "" });

  useNotificationHandler();

  useEffect(() => {
    const setupNotificationActions = async () => {
      await Notifications.setNotificationCategoryAsync("todo-actions", [
        {
          identifier: "mark-as-read",
          buttonTitle: "Mark as Read",
          options: { opensAppToForeground: false },
        },
        {
          identifier: "open-app",
          buttonTitle: "Open App",
          options: { opensAppToForeground: true },
        },
      ]);
    };

    setupNotificationActions();

    // --- FORCE UPDATE LOGIC (FIREBASE LISTENER) ---
    const unsubscribeVersion = firestore()
      .collection("versions")
      .onSnapshot((snapshot) => {
        if (snapshot && !snapshot.empty) {
          const data = snapshot.docs[0].data();
          const currentVersion = DeviceInfo.getVersion();

          if (currentVersion !== data.version) {
            setUpdateData({
              version: data.version,
              message: data.message,
              url: data.url,
            });
            setNeedsUpdate(true);
          } else {
            setNeedsUpdate(false);
          }
        }
      });

    const prepareApp = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();

    return () => unsubscribeVersion(); // Clean up listener
  }, []);

  if (!appReady) return null;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <FloatingButtonProvider>
            <NavigationContainer>
              <AuthStack />
            </NavigationContainer>

            {/* --- FORCE UPDATE OVERLAY --- */}
            {/* This sits on top of AuthStack and prevents any interaction if needsUpdate is true */}
            <Modal visible={needsUpdate} transparent animationType="slide">
              <View style={styles.forceUpdateOverlay}>
                <View style={styles.alertCard}>
                  <Text style={styles.alertTitle}>Update Required</Text>
                  <Text style={styles.alertSub}>Version {updateData.version} is now available</Text>
                  
                  <View style={styles.msgBox}>
                    <Text style={styles.msgText}>{updateData.message}</Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.updateBtn}
                    onPress={() => Linking.openURL(updateData.url || "https://google.com")}
                  >
                    <Text style={styles.updateBtnText}>UPDATE NOW</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            
          </FloatingButtonProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}

// --- MINIMAL STYLES FOR FORCE UPDATE ---
const styles = StyleSheet.create({
  forceUpdateOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)", // Darkens the background so user can't see the login page clearly
    justifyContent: "center",
    alignItems: "center",
  },
  alertCard: {
    width: width * 0.85,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  alertSub: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  msgBox: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    marginVertical: 20,
    width: "100%",
  },
  msgText: {
    textAlign: "center",
    color: "#444",
  },
  updateBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
  },
  updateBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});