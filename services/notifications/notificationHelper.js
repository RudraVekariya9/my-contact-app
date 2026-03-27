import * as Notifications from "expo-notifications";
import { saveNotification } from "./notificationStorage";
export async function scheduleTodoNotification(todoTitle, todoId) {
  const notificationData = {
    title: "Todo Completed 🎉",
    body: `${todoTitle} completed`,
    time: new Date().toISOString(),
  };

  //  SAVE IMMEDIATELY (IMPORTANT)
  

  //  Schedule notification
  await Notifications.scheduleNotificationAsync({
    content: {
      ...notificationData,
      data: { todoId },
    },
    trigger: {
      type : "timeInterval",
      seconds: 60, // or 120
      repeats: false, 
    },
  });
}