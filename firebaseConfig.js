import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-6tJwnwJ0X-TmPmCQD6A4q2MYsbt_Jk0",
  authDomain: "task-manager-app-8fc6a.firebaseapp.com",
  projectId: "task-manager-app-8fc6a",
  storageBucket: "task-manager-app-8fc6a.firebasestorage.app",
  messagingSenderId: "493529142252",
  appId: "1:493529142252:web:34f7f2fc59345d46ef66c9"
};

/* Prevent duplicate Firebase initialization */

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

/* Firebase Authentication */

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

/* Firestore Database */

export const db = getFirestore(app);