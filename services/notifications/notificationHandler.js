import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { updateUnreadCount } from "./notificationStorage";

//  MARK SINGLE AS READ
const markSingleAsRead = async (notificationId) => {
  try {
    const data = await AsyncStorage.getItem("APP_NOTIFICATIONS");
    const list = data ? JSON.parse(data) : [];

    const updated = list.map(item => {
      if (item.id === notificationId) {
        return { ...item, isRead: true };
      }
      return item;
    });

    await AsyncStorage.setItem("APP_NOTIFICATIONS", JSON.stringify(updated));

    console.log(" Marked as read:", notificationId);

  } catch (error) {
    console.log("Mark single read error:", error);
  }
};

export default function useNotificationHandler() {

  useEffect(() => {

    //  HANDLE ACTION BUTTONS + TAP
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {

        const actionId = response.actionIdentifier;

        const notification = response.notification;
        const notificationIdFromExpo = notification.request.identifier;

        const data = notification.request.content.data;
        const customNotificationId = data.notificationId;

        console.log(" Action:", actionId);

        //  MARK AS READ BUTTON
        if (actionId === "mark-as-read") {
          await markSingleAsRead(customNotificationId);

          //  UPDATE UNREAD COUNT
          await updateUnreadCount();

          console.log(" Mark as read from notification");
        }

        //  OPEN APP BUTTON
        if (actionId === "open-app") {
          console.log(" Open App clicked");
        }

        //  DEFAULT TAP (user taps notification body)
        if (actionId === Notifications.DEFAULT_ACTION_IDENTIFIER) {
          console.log(" Notification tapped");
        }

        //  REMOVE NOTIFICATION FROM TRAY
        await Notifications.dismissNotificationAsync(notificationIdFromExpo);

      }
    );

    return () => {
      subscription.remove();
    };

  }, []);

}