import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContactContext } from "../../context/ContactContext";
import { getUnreadCount } from "../../services/notifications/notificationStorage";

const RECENT_SEARCH_KEY = "@recent_searches";

export default function HomeHeader() {
  const navigation = useNavigation();
  const { searchTerm, setSearchTerm } = useContactContext();
  const [count, setCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState([]);

  // 1. Notification Count Logic
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

  // 2. Load History when clicking search
  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCH_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Save Search to History
  const handleSaveSearch = async (term = searchTerm) => {
    if (!term || term.trim() === "") return;
    
    const cleanTerm = term.trim();
    let newHistory = [cleanTerm, ...history.filter((item) => item !== cleanTerm)];
    newHistory = newHistory.slice(0, 10);
    
    setHistory(newHistory);
    await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(newHistory));
    setSearchTerm(cleanTerm);
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const removeHistoryItem = async (itemToRemove) => {
    const filtered = history.filter((item) => item !== itemToRemove);
    setHistory(filtered);
    await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(filtered));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* TOP ROW */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Ionicons name="menu" size={26} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.title}>My Contact App</Text>

          <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")}>
            <View style={{ position: "relative" }}>
              <Ionicons name="notifications-outline" size={26} color="#ffffff" />
              {count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{count}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search contact..."
            placeholderTextColor="#8e8e8e"
            value={searchTerm || ""}
            onFocus={() => {
              setIsFocused(true);
              loadHistory();
            }}
            onChangeText={(text) => setSearchTerm(text)}
            onSubmitEditing={() => handleSaveSearch()}
            returnKeyType="search"
          />
          {isFocused && (
            <TouchableOpacity 
              onPress={() => {
                setIsFocused(false);
                setSearchTerm("");
                Keyboard.dismiss();
              }} 
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* RECENT SEARCH OVERLAY 
            Only visible when: input is focused AND text is empty 
        */}
        {isFocused && searchTerm.length === 0 && (
          <View style={styles.historyOverlay}>
            <Text style={styles.historyTitle}>Recent searches</Text>
            <FlatList
              data={history}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.historyItem} onPress={() => handleSaveSearch(item)}>
                  <Text style={styles.historyText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeHistoryItem(item)}>
                    <Ionicons name="close" size={20} color="#8e8e8e" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#0b74e5",
    zIndex: 10,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    fontSize: 16,
    color: "#000",
  },
  cancelButton: {
    marginLeft: 10,
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
  },
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

  // NEW HISTORY STYLES
  historyOverlay: {
    position: 'absolute',
    top: 115, // Adjusted to sit right under your search bar
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    height: 1000, 
    zIndex: 100,
    paddingHorizontal: 20,
  },
  historyTitle: {
    color: "#8e8e8e",
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  historyText: {
    fontSize: 18,
    color: "#333",
  },
});