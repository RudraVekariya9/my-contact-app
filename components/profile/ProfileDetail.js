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
import * as MediaLibrary from "expo-media-library";

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
    requestGalleryPermission();
  }, []);

  const loadUser = async () => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email || "");
      try {
        const profile = await getUserProfile();
        setName(profile ? profile.username : "No Name");
      } catch {
        setName("Error loading name");
      }
    }
  };

  const loadSavedAvatar = async () => {
    const user = auth.currentUser;
    const key = `avatar_${user.uid}`;
    const saved = await AsyncStorage.getItem(key);
    if (saved !== null) {
      setSelectedAvatarIndex(parseInt(saved));
    } else {
      setSelectedAvatarIndex(0);
      await AsyncStorage.setItem(key, "0");
    }
  };

  const loadCustomImage = async () => {
    const user = auth.currentUser;
    const key = `profile_image_${user.uid}`;
    const saved = await AsyncStorage.getItem(key);
    if (saved) setCustomImage(saved);
  };

  const requestGalleryPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === "granted";
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted") return;

    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setCustomImage(uri);
      setSelectedAvatarIndex(null);
      await AsyncStorage.setItem(`profile_image_${auth.currentUser.uid}`, uri);
    }
    setShowSheet(false);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setCustomImage(uri);
      setSelectedAvatarIndex(null);
      await AsyncStorage.setItem(`profile_image_${auth.currentUser.uid}`, uri);
    }
    setShowSheet(false);
  };

  // UPDATED: STACKED BOTTOM SHEET LOGIC
  const pickAvatar = () => {
    // We do NOT call setShowSheet(false) so it stays open in the background
    setAvatarSheet(true); 
  };

  const handleAvatarSelect = async (index) => {
    const user = auth.currentUser;
    setSelectedAvatarIndex(index);
    setCustomImage(null);
    await AsyncStorage.setItem(`avatar_${user.uid}`, index.toString());

    setAvatarSheet(false); // Close the top sheet
    setShowSheet(false);   // Also close the background sheet after selection
  };

  const handleRemovePhoto = async () => {
    const user = auth.currentUser;
    setCustomImage(null);
    setSelectedAvatarIndex(0);
    await AsyncStorage.removeItem(`profile_image_${user.uid}`);
    await AsyncStorage.setItem(`avatar_${user.uid}`, "0");
    setRemovePopup(false);
    setShowSheet(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate("Login");
  };

  return (
    <Container>
      <Header />
      <AvatarContainer>
        <Avatar source={customImage ? { uri: customImage } : avatars[selectedAvatarIndex]} />
      </AvatarContainer>

      <TouchableOpacity onPress={() => setShowSheet(true)}>
        <EditText>Edit</EditText>
      </TouchableOpacity>

      <Content>
        <FieldBox><Label>Name</Label><Value>{name}</Value></FieldBox>
        <FieldBox><Label>Email</Label><Value>{email}</Value></FieldBox>
        <LogoutButton onPress={() => setLogoutPopup(true)}><LogoutText>Logout</LogoutText></LogoutButton>
      </Content>

      {/* BACKGROUND SHEET */}
      <ImagePickerSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        onGallery={pickFromGallery}
        onAvatar={pickAvatar}
        onRemove={() => setRemovePopup(true)}
        onCamera={openCamera}
      />

      {/* TOP SHEET (Stacked) */}
      <AvatarPickerSheet
        visible={avatarSheet}
        onClose={() => setAvatarSheet(false)}
        onSelect={handleAvatarSelect}
        selectedIndex={selectedAvatarIndex}
        isNested={true} // Only this sheet gets the transparent overlay
      />

      <ActionPopup visible={logoutPopup} message="Logout?" confirmText="Logout" onConfirm={handleLogout} onClose={() => setLogoutPopup(false)} />
      <ActionPopup visible={removePopup} message="Remove photo?" confirmText="Remove" onConfirm={handleRemovePhoto} onClose={() => setRemovePopup(false)} />
    </Container>
  );
}

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