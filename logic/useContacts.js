import { useState, useEffect, useRef } from "react";
import contactsData from "../Data/Contact.json";

export default function useContacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef(null);

  useEffect(() => {
    const sorted = [...contactsData].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setFilteredContacts(sorted);
  }, []);

  useEffect(() => {
    setLoading(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const filtered = contactsData
        .filter((contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));

      setFilteredContacts(filtered);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeoutRef.current);
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredContacts,
    loading,
  };
}