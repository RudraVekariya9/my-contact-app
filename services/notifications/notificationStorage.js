import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "APP_NOTIFICATIONS";
const UNREAD_KEY = "APP_UNREAD_COUNT";

// 💾 Save notification
export const saveNotification = async (notification) => {
  try {
    const existing = await AsyncStorage.getItem(KEY);
    const list = existing ? JSON.parse(existing) : [];

    list.unshift({
      ...notification,
      isRead: false, // 🔥 NEW FIELD
    });

    await AsyncStorage.setItem(KEY, JSON.stringify(list));

    // 🔴 increase unread count
    const unread = await AsyncStorage.getItem(UNREAD_KEY);
    const count = unread ? parseInt(unread) : 0;

    await AsyncStorage.setItem(UNREAD_KEY, (count + 1).toString());

  } catch (error) {
    console.log("Save error:", error);
  }
};

// 📥 Get all notifications
export const getNotifications = async () => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Fetch error:", error);
    return [];
  }
};

// 🔴 Get unread count
export const getUnreadCount = async () => {
  try {
    const count = await AsyncStorage.getItem(UNREAD_KEY);
    return count ? parseInt(count) : 0;
  } catch (error) {
    console.log("Unread error:", error);
    return 0;
  }
};

// 🔄 Reset unread count
export const resetUnreadCount = async () => {
  try {
    await AsyncStorage.setItem(UNREAD_KEY, "0");
  } catch (error) {
    console.log("Reset error:", error);
  }
};

// 🗑 Clear notifications
export const clearNotifications = async () => {
  try {
    await AsyncStorage.removeItem(KEY);
    await AsyncStorage.setItem(UNREAD_KEY, "0");
  } catch (error) {
    console.log("Clear error:", error);
  }
};

// 🔥 MARK ALL AS READ
export const markAllAsRead = async () => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    const list = data ? JSON.parse(data) : [];

    const updated = list.map(item => ({
      ...item,
      isRead: true,
    }));

    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
    await AsyncStorage.setItem(UNREAD_KEY, "0");

  } catch (error) {
    console.log("Mark read error:", error);
  }
};