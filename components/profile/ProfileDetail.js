import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Image, TouchableOpacity } from "react-native";
import ActionPopup from "../popup/ActionPopup";

import { getUserProfile } from "../../services/profileApi";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";

import { useNavigation } from "@react-navigation/native";
import ImagePickerSheet from "../bottom/ImagePickerSheet";
import AvatarPickerSheet from "../bottom/AvatarPickerSheet";

import { avatars } from "../../Data/avatars";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as ImagePicker from "expo-image-picker";

export default function ProfileDetail() {

  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [logoutPopup, setLogoutPopup] = useState(false);
  const [removePopup, setRemovePopup] = useState(false);

  const [showSheet, setShowSheet] = useState(false);
  const [avatarSheet, setAvatarSheet] = useState(false);

  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);
  const [customImage, setCustomImage] = useState(null);

  useEffect(() => {
    loadUser();
    loadSavedAvatar();
    loadCustomImage();
  }, []);

  const loadUser = async () => {
    const user = auth.currentUser;

    if (user) {
      setEmail(user.email || "");

      try {
        const profile = await getUserProfile();
        setName(profile ? profile.username : "No Name");
      } catch (error) {
        console.log("Profile fetch error:", error);
        setName("Error loading name");
      }
    }
  };

  const loadSavedAvatar = async () => {
    try {
      const user = auth.currentUser;
      const key = `avatar_${user.uid}`;

      const saved = await AsyncStorage.getItem(key);

      if (saved !== null) {
        setSelectedAvatarIndex(parseInt(saved));
      } else {
        setSelectedAvatarIndex(0);
        await AsyncStorage.setItem(key, "0");
      }

    } catch (error) {
      console.log("Error loading avatar:", error);
    }
  };

  const loadCustomImage = async () => {
    try {
      const user = auth.currentUser;
      const key = `profile_image_${user.uid}`;

      const saved = await AsyncStorage.getItem(key);

      if (saved) setCustomImage(saved);

    } catch (error) {
      console.log("Load image error:", error);
    }
  };

  // 🖼️ GALLERY (permission handled here if denied)
  const pickFromGallery = async () => {
    try {
      const permission = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (permission.status !== "granted") {
        const request = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (request.status !== "granted") {
          alert("Permission required to access gallery");
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        setCustomImage(uri);
        setSelectedAvatarIndex(null);

        const user = auth.currentUser;
        const key = `profile_image_${user.uid}`;

        await AsyncStorage.setItem(key, uri);
      }

      setShowSheet(false);

    } catch (error) {
      console.log("Gallery error:", error);
    }
  };

  const pickAvatar = () => {
    setShowSheet(false);
    setAvatarSheet(true);
  };

  const handleAvatarSelect = async (index) => {
    try {
      const user = auth.currentUser;
      const key = `avatar_${user.uid}`;

      setSelectedAvatarIndex(index);
      setCustomImage(null);

      await AsyncStorage.setItem(key, index.toString());

      setAvatarSheet(false);
    } catch (error) {
      console.log("Error saving avatar:", error);
    }
  };

  // 🗑️ REMOVE WITH POPUP
  const handleRemovePhoto = async () => {
    try {
      const user = auth.currentUser;

      setCustomImage(null);
      setSelectedAvatarIndex(0);

      await AsyncStorage.removeItem(`profile_image_${user.uid}`);
      await AsyncStorage.setItem(`avatar_${user.uid}`, "0");

      setRemovePopup(false);
      setShowSheet(false);
    } catch (error) {
      console.log("Remove error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <Container>

      <Header />

      <AvatarContainer>
        <Avatar
          source={
            customImage
              ? { uri: customImage }
              : avatars[selectedAvatarIndex]
          }
        />
      </AvatarContainer>

      <TouchableOpacity onPress={() => setShowSheet(true)}>
        <EditText>Edit</EditText>
      </TouchableOpacity>

      <Content>

        <FieldBox>
          <Label>Name</Label>
          <Value>{name}</Value>
        </FieldBox>

        <FieldBox>
          <Label>Email</Label>
          <Value>{email}</Value>
        </FieldBox>

        <LogoutButton onPress={() => setLogoutPopup(true)}>
          <LogoutText>Logout</LogoutText>
        </LogoutButton>

      </Content>

      <ImagePickerSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        onGallery={pickFromGallery}
        onAvatar={pickAvatar}
        onRemove={() => setRemovePopup(true)}
      />

      <AvatarPickerSheet
        visible={avatarSheet}
        onClose={() => setAvatarSheet(false)}
        onSelect={handleAvatarSelect}
        selectedIndex={selectedAvatarIndex}
      />

      <ActionPopup
        visible={logoutPopup}
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onClose={() => setLogoutPopup(false)}
      />

      <ActionPopup
        visible={removePopup}
        message="Remove profile photo?"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleRemovePhoto}
        onClose={() => setRemovePopup(false)}
      />

    </Container>
  );
}


/* ---------- STYLES ---------- */

const Container = styled.View`
  flex: 1;
  background-color: #eaf3ff;
  align-items: center;
`;

const Header = styled.View`
  width: 100%;
  height: 80px;
  background-color: #0b74e5;
`;

const AvatarContainer = styled.View`
  margin-top: -50px;
  margin-bottom: 10px;
  width: 120px;
  height: 120px;
  border-radius: 60px;
  overflow: hidden;
  border-width: 4px;
  border-color: #ffffff;
  elevation: 5;
`;

const Avatar = styled(Image)`
  width: 100%;
  height: 100%;
`;

const EditText = styled.Text`
  color: #0b74e5;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 15px;
  text-align: center;
`;

const Content = styled.View`
  width: 100%;
  padding: 20px;
`;

const FieldBox = styled.View`
  background-color: #f2f8ff;
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 15px;
  elevation: 3;
`;

const Label = styled.Text`
  font-size: 12px;
  color: #777;
`;

const Value = styled.Text`
  font-size: 18px;
  font-weight: 600;
  margin-top: 5px;
  color: #000;
`;

const LogoutButton = styled.TouchableOpacity`
  border-width: 1px;
  border-color: #0b74e5;
  padding: 14px;
  border-radius: 12px;
  align-items: center;
  margin-top: 20px;
`;

const LogoutText = styled.Text`
  color: #0b74e5;
  font-size: 16px;
  font-weight: bold;
`;