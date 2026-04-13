import React, { useState, useEffect, useContext } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FloatingButtonContext } from "../../context/FloatingButtonContext";

export default function SettingHome() {
  const [isEnabled, setIsEnabled] = useState(true);
  const { enabled, toggleFloating } = useContext(FloatingButtonContext);

  
  useEffect(() => {
    const loadSetting = async () => {
      try {
        const savedValue = await AsyncStorage.getItem("notificationsEnabled");
        if (savedValue !== null) {
          setIsEnabled(JSON.parse(savedValue));
        }
      } catch (error) {
        console.log("Error loading setting:", error);
      }
    };

    loadSetting();
  }, []);

  
  const toggleSwitch = async () => {
    try {
      const newValue = !isEnabled;
      setIsEnabled(newValue);

      await AsyncStorage.setItem(
        "notificationsEnabled",
        JSON.stringify(newValue)
      );
    } catch (error) {
      console.log("Error saving setting:", error);
    }
  };

  return (
    <View style={styles.container}>

      
      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={isEnabled}
          onValueChange={toggleSwitch}
          trackColor={{ false: "#ccc", true: "#0b74e5" }}
          thumbColor="#ffffff"
        />
      </View>

  
      <Text style={styles.sectionTitle}>Home</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Floating Button</Text>
        <Switch
          value={enabled}
          onValueChange={toggleFloating}
          trackColor={{ false: "#ccc", true: "#0b74e5" }}
          thumbColor="#ffffff"
        />
      </View>

    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6b7280",
    marginBottom: 8,
    marginTop: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
  },
});