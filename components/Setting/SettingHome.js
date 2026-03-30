import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingHome() {
  const [isEnabled, setIsEnabled] = useState(true);

  // 🔹 Load saved value on mount
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

  // 🔹 Toggle + Save
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
      <View style={styles.row}>
        <Text style={styles.label}>Notifications</Text>

        <Switch
          value={isEnabled}
          onValueChange={toggleSwitch}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
});