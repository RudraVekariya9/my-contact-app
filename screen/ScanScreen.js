import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import TextRecognition from "@react-native-ml-kit/text-recognition";

const ScanScreen = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  //  Pick from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  //  Open camera
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert("Camera permission required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  //  OCR processing
  const processImage = async (uri) => {
    setImage(uri);
    setLoading(true);
    setText("");

    try {
      const res = await TextRecognition.recognize(uri);
      setText(res.text);
    } catch (error) {
      console.log("OCR Error:", error);
    }

    setLoading(false);
  };

  //  Reset scan
  const resetScan = () => {
    setImage(null);
    setText("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>📄 Document Scanner</Text>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={openCamera}>
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Image Preview */}
        {image && (
          <Image source={{ uri: image }} style={styles.image} />
        )}

        {/* Reset Button */}
        {image && (
          <TouchableOpacity style={styles.deleteButton} onPress={resetScan}>
            <Text style={styles.deleteText}>Scan Again 🔄</Text>
          </TouchableOpacity>
        )}

        {/* Loader */}
        {loading && (
          <ActivityIndicator size="large" color="#0b74e5" style={{ marginTop: 20 }} />
        )}

        {/* Extracted Text */}
        {text !== "" && !loading && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Extracted Text</Text>
            <Text style={styles.resultText}>{text}</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    flex: 1,
    backgroundColor: "#0b74e5",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  image: {
    width: "100%",
    height: 220,
    marginTop: 20,
    borderRadius: 10,
  },

  deleteButton: {
    marginTop: 15,
    backgroundColor: "#ff4d4d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },

  resultBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f2f8ff",
    borderRadius: 10,
  },

  resultTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  resultText: {
    lineHeight: 20,
  },
});