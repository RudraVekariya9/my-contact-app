import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FloatingButtonContext = createContext();

export const FloatingButtonProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(true);

  // Load from storage
  useEffect(() => {
    const load = async () => {
      const value = await AsyncStorage.getItem("floatingButtonEnabled");
      setEnabled(JSON.parse(value ?? "true"));
    };
    load();
  }, []);

  // Toggle function
  const toggleFloating = async () => {
    const newValue = !enabled;
    setEnabled(newValue);
    await AsyncStorage.setItem(
      "floatingButtonEnabled",
      JSON.stringify(newValue)
    );
  };

  return (
    <FloatingButtonContext.Provider value={{ enabled, toggleFloating }}>
      {children}
    </FloatingButtonContext.Provider>
  );
};