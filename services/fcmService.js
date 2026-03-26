import messaging from '@react-native-firebase/messaging';

export async function getFCMToken() {
  try {
    // Ask permission
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log("❌ Permission denied");
      return null;
    }

    // Get token
    const token = await messaging().getToken();

    console.log("🔥 FCM TOKEN:", token);

    return token; // ✅ VERY IMPORTANT
  } catch (error) {
    console.log("FCM ERROR:", error);
    return null;
  }
}