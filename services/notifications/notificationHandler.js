import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import { navigate } from "../../navigation/utils/navigationRef";

import { saveNotification } from "./notificationStorage";

export default function useNotificationHandler() {

  // 🔹 Permission
  useEffect(() => {
    const requestExpoPermission = async () => {
      if (Device.isDevice) {
        await Notifications.requestPermissionsAsync();
      }
    };

    requestExpoPermission();
  }, []);

  // 🔹 Foreground FCM
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const messagingInstance = getMessaging(getApp());

        await requestPermission(messagingInstance);

        onMessage(messagingInstance, async remoteMessage => {
          if (remoteMessage?.notification) {
            onMessage(messagingInstance, async remoteMessage => {
            // keep empty OR just process silently
            });
          }
        });
      } catch {}
    };

    setupFCM();
  }, []);

  // 🔹 Click handling
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

  // 🔹 Save notifications
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        try {
          const value = await AsyncStorage.getItem("notificationsEnabled");
          const enabled = JSON.parse(value || "true");

          if (!enabled) return;

          const data = notification.request.content;

          await saveNotification({
            title: data.title,
            body: data.body,
            time: new Date().toISOString(),
          });

        } catch {}
      }
    );

    return () => subscription.remove();
  }, []);
}