import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { fetchContactsAxios } from "../../services/contactApi";
import { useContactContext } from "../../context/ContactContext";
import ActionPopup from "../popup/ActionPopup";

export default function ContactDetailHome({ route }) {

  const { name, role, phone, image } = route.params;
  const { addFavorite } = useContactContext();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      await fetchContactsAxios();

      setUser({
        name: name,
        role: role,
        phone: phone,
        image: image
      });

      setLoading(false);
    } catch (error) {
      console.log("Axios error:", error);
      setLoading(false);
    }
  };

  const handleAddFavorite = async () => {
    try {
      await addFavorite({
        name: user.name,
        role: user.role,
        phone: user.phone
      });

      setShowPopup(false);
    } catch (error) {
      console.log("Favorite error:", error);
    }
  };

  if (loading) {
    return (
      <Container>
        <InfoText>Loading user details...</InfoText>
      </Container>
    );
  }

  return (
    <Container>

      
      <Avatar>
        {user.image ? (
          <AvatarImage source={{ uri: user.image }} />
        ) : (
          <AvatarText>{user.name[0]}</AvatarText>
        )}
      </Avatar>

     
      <Card>

        <FieldBox>
          <Label>Name</Label>
          <Value>{user.name}</Value>
        </FieldBox>

        <FieldBox>
          <Label>Role</Label>
          <Value>{user.role}</Value>
        </FieldBox>

        <FieldBox>
          <Label>Phone</Label>
          <Value>{user.phone}</Value>
        </FieldBox>

      </Card>

      
      <FavoriteButton onPress={() => setShowPopup(true)}>
        <ButtonText>Mark as Favorite</ButtonText>
      </FavoriteButton>

  
      <ActionPopup
        visible={showPopup}
        message="Add this contact to favorites?"
        confirmText="Add"
        cancelText="Cancel"
        onConfirm={handleAddFavorite}
        onClose={() => setShowPopup(false)}
      />

    </Container>
  );
}

/* -------- STYLES -------- */

const Container = styled.View`
  flex: 1;
  background-color: #eaf3ff;
  padding: 20px;
  align-items: center;
`;


const Avatar = styled.View`
  width: 90px;
  height: 90px;
  border-radius: 45px;
  background-color: #0b74e5;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const AvatarText = styled.Text`
  color: #ffffff;
  font-size: 32px;
  font-weight: bold;
`;

const Card = styled.View`
  width: 100%;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 20px;
  margin-top: 20px;
  elevation: 5;
`;


const FieldBox = styled.View`
  background-color: #f2f8ff;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 12px;
`;

const Label = styled.Text`
  font-size: 12px;
  color: #777;
`;

const Value = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-top: 4px;
  color: #000;
`;


const FavoriteButton = styled.TouchableOpacity`
  width: 100%;
  margin-top: 20px;
  background-color: #0b74e5;
  padding: 14px;
  border-radius: 12px;
  align-items: center;
  elevation: 3;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;


const InfoText = styled.Text`
  font-size: 18px;
`;
const AvatarImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 45px;
  border-width: 2px;
  border-color: white;
  elevation: 5;
`;