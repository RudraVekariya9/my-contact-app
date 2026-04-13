import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function VideoCallScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { contact } = route.params;

  const [permission, requestPermission] = useCameraPermissions();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // ✅ NEW: Camera type
  const [cameraType, setCameraType] = useState("back");

  // 🔄 Toggle Camera
  const toggleCamera = () => {
    setCameraType((prev) => (prev === "back" ? "front" : "back"));
  };

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10 }}>Camera permission required</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "blue" }}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* 👆 DOUBLE TAP TO SWITCH CAMERA */}
      <TouchableWithoutFeedback onPress={toggleCamera}>
        <View style={{ flex: 1 }}>

          {isVideoOn && (
            <CameraView
              style={styles.camera}
              facing={cameraType} // ✅ FRONT / BACK
            />
          )}

        </View>
      </TouchableWithoutFeedback>

      {/* CALL INFO */}
      <View style={styles.topOverlay}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.calling}>Calling...</Text>
      </View>

      {/* CONTROLS */}
      <View style={styles.controls}>

        {/* MUTE */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Ionicons
            name={isMuted ? "mic-off" : "mic"}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        {/* VIDEO TOGGLE */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setIsVideoOn(!isVideoOn)}
        >
          <Ionicons
            name={isVideoOn ? "videocam" : "videocam-off"}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        {/* 🔄 SWITCH CAMERA BUTTON */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={toggleCamera}
        >
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>

        {/* END CALL */}
        <TouchableOpacity
          style={[styles.controlBtn, styles.endCall]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>

      </View>

    </View>
  );
}

/* -------- STYLES -------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topOverlay: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    alignItems: "center",
  },
  name: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },
  calling: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 5,
  },
  controls: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  controlBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  endCall: {
    backgroundColor: "red",
  },
});