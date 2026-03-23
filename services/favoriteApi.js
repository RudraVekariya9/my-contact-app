import { db, auth } from "../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

/* ADD FAVORITE */

export const addFavoriteFirestore = async (contact) => {

  const user = auth.currentUser;

  if (!user) {
    console.log("User not logged in");
    return;
  }

  const favRef = collection(db, "users", user.uid, "favorites");

  await addDoc(favRef, {
    name: contact.name,
    role: contact.role,
    phone: contact.phone
  });

};

/* GET FAVORITES */

export const getFavoritesFirestore = async () => {

  const user = auth.currentUser;

  if (!user) return [];

  const favRef = collection(db, "users", user.uid, "favorites");

  const snapshot = await getDocs(favRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

};

/* REMOVE FAVORITE */

export const removeFavoriteFirestore = async (id) => {

  const user = auth.currentUser;

  if (!user) return;

  const favDoc = doc(db, "users", user.uid, "favorites", id);

  await deleteDoc(favDoc);

};