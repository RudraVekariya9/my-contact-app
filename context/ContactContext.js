import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchContacts } from "../services/contactApi";
import {
  addFavoriteFirestore,
  getFavoritesFirestore,
  removeFavoriteFirestore
} from "../services/favoriteApi";

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    await loadContacts();
    await loadFavorites();
  };

  /* ---------------- LOAD CONTACTS ---------------- */

  const loadContacts = async () => {
    try {
      const data = await fetchContacts();
      const sortedContacts = data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setContacts(sortedContacts);
      setFilteredContacts(sortedContacts);
      setLoading(false);
    } catch (error) {
      console.log("Error loading contacts:", error);
      setLoading(false);
    }
  };

  /* ---------------- LOAD FAVORITES ---------------- */

  const loadFavorites = async () => {
    try {
      const data = await getFavoritesFirestore();
      if (data) {
        setFavorites(data);
      }
    } catch (error) {
      console.log("Error loading favorites:", error);
    }
  };

  /* ---------------- ADD FAVORITE ---------------- */

  const addFavorite = async (contact) => {
    try {
      await addFavoriteFirestore(contact);
      await loadFavorites();
    } catch (error) {
      console.log("Add favorite error:", error);
    }
  };

  /* ---------------- REMOVE FAVORITE ---------------- */

  const removeFavorite = async (id) => {
    try {
      await removeFavoriteFirestore(id);
      await loadFavorites();
    } catch (error) {
      console.log("Remove favorite error:", error);
    }
  };

  /* ---------------- SEARCH CONTACTS ---------------- */

 useEffect(() => {
  const filtered = contacts.filter((contact) => {
    const search = searchTerm.toLowerCase();

    return (
      contact.name?.toLowerCase().includes(search) ||
      contact.phone?.toLowerCase().includes(search) ||
      contact.role?.toLowerCase().includes(search)
    );
  });

  setFilteredContacts(filtered);
}, [searchTerm, contacts]);

  /* ---------------- CONTEXT VALUE ---------------- */

  return (
    <ContactContext.Provider
      value={{
        contacts,
        filteredContacts,
        favorites,
        addFavorite,
        removeFavorite,
        loading,
        searchTerm,
        setSearchTerm
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContactContext = () => useContext(ContactContext);