import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "APP_NOTIFICATIONS";
const UNREAD_KEY = "APP_UNREAD_COUNT";

// SAVE (NO COUNT INCREASE)
export const saveNotification = async (notification) => {
  try {
    const existing = await AsyncStorage.getItem(KEY);
    const list = existing ? JSON.parse(existing) : [];

    list.unshift({
      ...notification,
      isRead: false,
    });

    await AsyncStorage.setItem(KEY, JSON.stringify(list));

  } catch (error) {
    console.log("Save error:", error);
  }
};

//  UPDATE COUNT BASED ON VISIBLE ITEMS
export const updateUnreadCount = async () => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    const list = data ? JSON.parse(data) : [];

    const now = Date.now();

    const unread = list.filter(
      item => !item.isRead && now >= (item.scheduledTime || 0)
    ).length;

    await AsyncStorage.setItem(UNREAD_KEY, unread.toString());

  } catch (error) {
    console.log("Count error:", error);
  }
};

export const getNotifications = async () => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getUnreadCount = async () => {
  try {
    const count = await AsyncStorage.getItem(UNREAD_KEY);
    return count ? parseInt(count) : 0;
  } catch {
    return 0;
  }
};

export const resetUnreadCount = async () => {
  try {
    await AsyncStorage.setItem(UNREAD_KEY, "0");
  } catch {}
};

export const clearNotifications = async () => {
  try {
    await AsyncStorage.removeItem(KEY);
    await AsyncStorage.setItem(UNREAD_KEY, "0");
  } catch {}
};

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

  } catch {}
};