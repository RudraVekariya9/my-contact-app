import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Image } from "react-native";
import ActionPopup from "../popup/ActionPopup";
import { getUserProfile } from "../../services/profileApi";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";

export default function ProfileDetail({ navigation }) {

  const [name, setName] = useState(""); // will stay empty
  const [email, setEmail] = useState("");
  const [logoutPopup, setLogoutPopup] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
  const user = auth.currentUser;

  if (user) {
    setEmail(user.email || "");

    const profile = await getUserProfile();

    if (profile) {
      setName(profile.username);
    } else {
      setName("No Name");
    }
  }
};

  return (
    <Container>

      {/* HEADER */}
      <Header />

      {/* AVATAR */}
      <AvatarContainer>
        <Avatar source={require("../../assets/profile.jpeg")} />
      </AvatarContainer>

      {/* CONTENT */}
      <Content>

        <FieldBox>
          <Label>Name</Label>
          <Value>{name}</Value>
        </FieldBox>

        <FieldBox>
          <Label>Email</Label>
          <Value>{email}</Value>
        </FieldBox>

        {/* LOGOUT BUTTON */}
        <LogoutButton onPress={() => setLogoutPopup(true)}>
          <LogoutText>Logout</LogoutText>
        </LogoutButton>

      </Content>

      {/* POPUP */}
      <ActionPopup
        visible={logoutPopup}
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={async () => {
          await signOut(auth);
          navigation.replace("Login");
        }}
        onClose={() => setLogoutPopup(false)}
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
  margin-bottom: 15px;
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