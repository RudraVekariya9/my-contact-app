import { db, auth } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

/* CREATE PROFILE */

export const createUserProfile = async (user, username, email, address) => {

  if (!user) {
    console.log("No user found");
    return;
  }

  try {
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      address: address, // This will store street, city, state, and pincode
      createdAt: new Date().toISOString()
    });

    console.log("Profile saved! with address!");
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