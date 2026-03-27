import { getMessaging, getToken, requestPermission } from "@react-native-firebase/messaging";
import { getApp } from "@react-native-firebase/app";

export async function getFCMToken() {
  try {
    const messagingInstance = getMessaging(getApp());

    // request permission
    await requestPermission(messagingInstance);

    // get token
    const token = await getToken(messagingInstance);

    console.log(" FCM TOKEN:", token);

    return token;
  } catch (error) {
    console.log("FCM ERROR:", error);
    return null;
  }
}