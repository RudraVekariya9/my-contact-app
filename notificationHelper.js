import * as Notifications from "expo-notifications";

export async function scheduleTodoNotification(todoTitle) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Todo Completed 🎉",
      body: `${todoTitle} completed 5 minutes ago`,
    },
    trigger: {
      type: "timeInterval",   
      seconds: 5 * 60,
      repeats: false,
    },
  });
}