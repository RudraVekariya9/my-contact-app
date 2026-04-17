import { db, auth } from "../firebaseConfig";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

/* CREATE PROFILE */

export const createUserProfile = async (
  user,
  username,
  email,
  address,
  birthdate
) => {

  if (!user) {
    console.log("No user found");
    return;
  }

  try {
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      address: address,
      birthdate: birthdate,
      createdAt: new Date().toISOString()
    });

    console.log("Profile saved! with address + birthdate!");
  } catch (error) {
    console.log("Create profile error:", error);
    throw error;
  }
};


/* GET PROFILE */

export const getUserProfile = async () => {
  const user = auth.currentUser;

  if (!user) return null;

  try {
    const docRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return snapshot.data();
    }

    return null;
  } catch (error) {
    console.log("Get profile error:", error);
    return null;
  }
};


/* ✅ NEW: UPDATE PROFILE */

export const updateUserProfile = async (userId, updatedData) => {
  try {
    const docRef = doc(db, "users", userId);

    await updateDoc(docRef, updatedData);

    console.log("Profile updated successfully!");
  } catch (error) {
    console.log("Update profile error:", error);
    throw error;
  }
};