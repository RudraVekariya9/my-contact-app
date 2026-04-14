import * as Notifications from "expo-notifications";
import { saveNotification } from "./notificationStorage";

const generateId = () => Date.now().toString();

export async function scheduleTodoNotification(todoTitle, todoId) {
  try {
    const notificationId = generateId();

    const scheduledTime = Date.now() + 10000;

    await saveNotification({
      id: notificationId,
      title: "Todo Completed 🎉",
      body: `${todoTitle} completed`,
      time: new Date().toISOString(),
      scheduledTime,
      todoId,
      isRead: false,
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Todo Completed 🎉",
        body: `${todoTitle} completed`,
        data: { notificationId, todoId },
        categoryIdentifier: "todo-actions",
      },
      trigger: {
        type: "timeInterval",
        seconds: 10,
      },
    });

  } catch (error) {
    console.log("Notification error:", error);
  }
}