import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Image, TouchableOpacity, ScrollView } from "react-native"; // Added ScrollView
import ActionPopup from "../popup/ActionPopup";
import { Ionicons } from "@expo/vector-icons"; // Added for icons

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

import { updateUserProfile } from "../../services/profileApi";

export default function ProfileDetail() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // New State for Address
  const [address, setAddress] = useState(null);

  const [logoutPopup, setLogoutPopup] = useState(false);
  const [removePopup, setRemovePopup] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [avatarSheet, setAvatarSheet] = useState(false);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);
  const [customImage, setCustomImage] = useState(null);
  const [birthdate, setBirthdate] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState("");
  const [editBirthdate, setEditBirthdate] = useState("");

  // For new Address editing
  const [editStreet, setEditStreet] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editPincode, setEditPincode] = useState("");

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
        if (profile) {
          setName(profile.username);
          setAddress(profile.address);
          setBirthdate(profile.birthdate); 
        } else {
          setName("No Name");
        }
      } catch (error) {
        setName("Error loading profile");
        console.log(error);
      }
    }
  };

  // ... (Your existing loadSavedAvatar, loadCustomImage, openCamera, etc. functions stay exactly the same)
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

  const pickAvatar = () => { setAvatarSheet(true); };

  const handleAvatarSelect = async (index) => {
    const user = auth.currentUser;
    setSelectedAvatarIndex(index);
    setCustomImage(null);
    await AsyncStorage.setItem(`avatar_${user.uid}`, index.toString());
    setAvatarSheet(false);
    setShowSheet(false);
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
    navigation.replace("Login"); // Use replace to clear stack
  };

  const handleSave = async () => {
  try {
    if (!editName) {
      alert("Name is required");
      return;
    }

    if (!editBirthdate) {
      alert("Birthdate is required");
      return;
    }

    if (!editStreet || !editCity || !editState || !editPincode) {
      alert("Please fill all address fields");
      return;
    }
    
    const user = auth.currentUser;

    const updatedData = {
      username: editName,
      birthdate: editBirthdate,
      address: {
        street: editStreet,
        city: editCity,
        state: editState,
        pincode: editPincode,
      },
    };

    //  Update Firebase
    await updateUserProfile(user.uid, updatedData);

    //  Update UI instantly
    setName(editName);
    setBirthdate(editBirthdate);
    setAddress(updatedData.address);

    //  Exit edit mode
    setIsEditing(false);

  } catch (error) {
    console.log("Save error:", error);
  }
};

  return (
    <Container>
      <ScrollView contentContainerStyle={{ alignItems: 'center', width: '100%' }} showsVerticalScrollIndicator={false}>
        <Header />
        <AvatarContainer>
          <Avatar source={customImage ? { uri: customImage } : avatars[selectedAvatarIndex]} />
        </AvatarContainer>

        <TouchableOpacity onPress={() => setShowSheet(true)}>
          <EditText>Edit Photo</EditText>
        </TouchableOpacity>

        <Content>
          {/* Identity Section */}
          <SectionHeader>
            <SectionLabel>Personal Info</SectionLabel>

            <EditButton
              onPress={() => {
                  setIsEditing(true);
                  setEditName(name);
                  setEditBirthdate(birthdate);

                  setEditStreet(address?.street || "");
                  setEditCity(address?.city || "");
                  setEditState(address?.state || "");
                  setEditPincode(address?.pincode || "");
                }}
            >
              <Ionicons name="create-outline" size={18} color="#0b74e5" />
              <EditButtonText>Edit</EditButtonText>
            </EditButton>
          </SectionHeader>

          {isEditing && (
            <EditActions>
              <ActionButton onPress={() => setIsEditing(false)}>
                <ActionText>Cancel</ActionText>
              </ActionButton>

              <ActionButton primary onPress={handleSave}>
                <ActionText primary>Save</ActionText>
              </ActionButton>
            </EditActions>
          )}

          <FieldBox>
            <Label>Name</Label>

            {isEditing ? (
              <Input
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter name"
              />
            ) : (
              <Value>{name}</Value>
            )}
          </FieldBox>
          <FieldBox>
            <Label>Email</Label>
            <Value>{email}</Value>
          </FieldBox>

          <FieldBox>
            <Label>Birthdate</Label>

            {isEditing ? (
              <Input
                value={editBirthdate}
                onChangeText={setEditBirthdate}
                placeholder="YYYY-MM-DD"
              />
            ) : (
              <Value>{birthdate ? birthdate : "Not provided"}</Value>
            )}
          </FieldBox>

          {/* Address Section */}
          <SectionLabel>Saved Address</SectionLabel>

            <AddressCard>
              <AddressHeader>
                <Ionicons name="location-outline" size={20} color="#0b74e5" />
                <AddressTitle>Current Location</AddressTitle>
              </AddressHeader>

              {isEditing ? (
                <AddressBody>

                  <Input
                    placeholder="Street"
                    value={editStreet}
                    onChangeText={setEditStreet}
                  />

                  <Input
                    placeholder="City"
                    value={editCity}
                    onChangeText={setEditCity}
                  />

                  <Input
                    placeholder="State"
                    value={editState}
                    onChangeText={setEditState}
                  />

                  <Input
                    placeholder="Pincode"
                    value={editPincode}
                    onChangeText={setEditPincode}
                    keyboardType="numeric"
                  />

                  <LocationButton>
                    <Ionicons name="location" size={18} color="#0b74e5" />
                    <LocationText>Use Current Location</LocationText>
                  </LocationButton>

                </AddressBody>
              ) : (
                <>
                  {address ? (
                    <AddressBody>
                      <AddressText>{address.street || "No street info"}</AddressText>
                      <AddressText>{address.city}, {address.state}</AddressText>

                      <PincodeBadge>
                        <PincodeText>PIN: {address.pincode}</PincodeText>
                      </PincodeBadge>
                    </AddressBody>
                  ) : (
                    <AddressText
                      style={{
                        color: "#aaa",
                        fontStyle: "italic",
                        marginTop: 10,
                      }}
                    >
                      No address provided.
                    </AddressText>
                  )}
                </>
              )}
            </AddressCard>


          <LogoutButton onPress={() => setLogoutPopup(true)}>
            <LogoutText>Logout</LogoutText>
          </LogoutButton>
        </Content>
      </ScrollView>

      {/* MODALS & SHEETS */}
      <ImagePickerSheet visible={showSheet} onClose={() => setShowSheet(false)} onGallery={pickFromGallery} onAvatar={pickAvatar} onRemove={() => setRemovePopup(true)} onCamera={openCamera} />
      <AvatarPickerSheet visible={avatarSheet} onClose={() => setAvatarSheet(false)} onSelect={handleAvatarSelect} selectedIndex={selectedAvatarIndex} isNested={true} />
      <ActionPopup visible={logoutPopup} message="Logout?" confirmText="Logout" onConfirm={handleLogout} onClose={() => setLogoutPopup(false)} />
      <ActionPopup visible={removePopup} message="Remove photo?" confirmText="Remove" onConfirm={handleRemovePhoto} onClose={() => setRemovePopup(false)} />
    </Container>
  );
}

/* STYLES */

const Container = styled.View`
  flex: 1;
  background-color: #eaf3ff;
`;

const Header = styled.View`
  width: 100%;
  height: 100px;
  background-color: #0b74e5;
`;

const AvatarContainer = styled.View`
  margin-top: -60px;
  width: 120px;
  height: 120px;
  border-radius: 60px;
  overflow: hidden;
  border-width: 4px;
  border-color: #ffffff;
  elevation: 8;
  background-color: #fff;
`;

const Avatar = styled(Image)`
  width: 100%;
  height: 100%;
`;

const EditText = styled.Text`
  color: #0b74e5;
  font-size: 15px;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 15px;
`;

const Content = styled.View`
  width: 100%;
  padding: 20px;
`;

const SectionLabel = styled.Text`
  font-size: 14px;
  color: #0b74e5;
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: 5px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FieldBox = styled.View`
  background-color: #fff;
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 15px;
  elevation: 2;
  border-left-width: 5px;
  border-left-color: #0b74e5;
`;

const Label = styled.Text`
  font-size: 11px;
  color: #777;
  text-transform: uppercase;
`;

const Value = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin-top: 3px;
`;

const AddressCard = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  elevation: 3;
`;

const AddressHeader = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  padding-bottom: 10px;
  margin-bottom: 12px;
`;

const AddressTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-left: 8px;
`;

const AddressBody = styled.View``;

const AddressText = styled.Text`
  font-size: 15px;
  color: #555;
  line-height: 22px;
`;

const PincodeBadge = styled.View`
  background-color: #eaf3ff;
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 8px;
  margin-top: 10px;
`;

const PincodeText = styled.Text`
  color: #0b74e5;
  font-weight: bold;
  font-size: 13px;
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: #fff;
  border-width: 1.5px;
  border-color: #ff4d4d;
  padding: 14px;
  border-radius: 12px;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 30px;
`;

const LogoutText = styled.Text`
  color: #ff4d4d;
  font-size: 16px;
  font-weight: bold;
`;
const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 5px;
`;

const EditButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const EditButtonText = styled.Text`
  color: #0b74e5;
  font-weight: bold;
  margin-left: 4px;
  font-size: 14px;
`;
const Input = styled.TextInput`
  border: 1px solid #0b74e5;
  padding: 10px;
  border-radius: 8px;
  margin-top: 5px;
  color: #333;
`;
const EditActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 10px 20px;
  border-radius: 8px;
  background-color: ${(props) => (props.primary ? "#0b74e5" : "#eee")};
`;

const ActionText = styled.Text`
  color: ${(props) => (props.primary ? "#fff" : "#333")};
  font-weight: bold;
`;
const LocationButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 1.5px dashed #0b74e5;
  border-radius: 10px;
  background-color: #f0f7ff;
  margin-top: 10px;
`;

const LocationText = styled.Text`
  color: #0b74e5;
  font-weight: bold;
  margin-left: 8px;
`;