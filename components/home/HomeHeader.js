import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContactContext } from "../../context/ContactContext";
import { getUnreadCount } from "../../services/notifications/notificationStorage";

export default function HomeHeader() {
  const navigation = useNavigation();
  const { searchTerm, setSearchTerm } = useContactContext();

  const [count, setCount] = useState(0); //  BADGE COUNT

  //  Load notification count
  useEffect(() => {
  const loadCount = async () => {
    try {
      const unread = await getUnreadCount();
      setCount(unread);
    } catch (error) {
      console.log("Count error:", error);
    }
  };

  loadCount();

  const interval = setInterval(loadCount, 1000);

  return () => clearInterval(interval);
}, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Top Row */}
        <View style={styles.topRow}>

          {/* Drawer */}
          <TouchableOpacity
            onPress={() =>
              navigation.dispatch(DrawerActions.openDrawer())
            }
          >
            <Ionicons name="menu" size={26} color="#ffffff" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>My Contact App</Text>

          {/*  Notifications with Badge */}
          <TouchableOpacity
            onPress={() => navigation.navigate("NotificationScreen")}
          >
            <View style={{ position: "relative" }}>

              <Ionicons
                name="notifications-outline"
                size={26}
                color="#ffffff"
              />

              {count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {count}
                  </Text>
                </View>
              )}

            </View>
          </TouchableOpacity>

        </View>

        {/* Search */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search contact..."
          placeholderTextColor="#ccc"
          value={searchTerm || ""}
          onChangeText={(text) => setSearchTerm(text)}
        />

      </View>
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#0b74e5",
  },
  container: {
    padding: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  searchInput: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    fontSize: 16,
  },

  // 🔴 BADGE STYLE
  badge: {
    position: "absolute",
    top: -5,
    right: -8,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});