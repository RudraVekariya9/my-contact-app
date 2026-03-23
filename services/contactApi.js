import axios from "axios";

export const CONTACT_API = "https://dummyjson.com/c/40a0-b13f-4825-8b1c";

// Fetch API function
export const fetchContacts = async () => {
  try {
    const response = await fetch(CONTACT_API);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Fetch API error:", error);
    return [];
  }
};

// Axios API function
export const fetchContactsAxios = async () => {
  try {
    const response = await axios.get(CONTACT_API);
    return response.data;
  } catch (error) {
    console.log("Axios error:", error);
    return [];
  }
};