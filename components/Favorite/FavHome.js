import React, { useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { useContactContext } from "../../context/ContactContext";
import ActionPopup from "../popup/ActionPopup";
import { Ionicons } from "@expo/vector-icons";

export default function FavHome() {

  const { favorites, removeFavorite } = useContactContext();

  const [showPopup, setShowPopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const confirmRemove = (id) => {
    setSelectedId(id);
    setShowPopup(true);
  };

  const handleRemove = async () => {
    await removeFavorite(selectedId);
    setShowPopup(false);
  };

  if (!favorites || favorites.length === 0) {
    return (
      <Container>
        <EmptyText>No Favorite Contacts Yet</EmptyText>
      </Container>
    );
  }

  return (
    <Container>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <Card>

            <InfoContainer>
              <Name>{String(item.name || "")}</Name>
              <Role>{String(item.role || "")}</Role>
              <Phone>{String(item.phone || "")}</Phone>
            </InfoContainer>

            <RemoveButton onPress={() => confirmRemove(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#fffffff" />
            </RemoveButton>

          </Card>

        )}
      />

      <ActionPopup
        visible={showPopup}
        message="Remove this contact from favorites?"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleRemove}
        onClose={() => setShowPopup(false)}
      />

    </Container>
  );
}

/* ---------- styles ---------- */

const Container = styled.View`
  flex: 1;
  padding: 10px;
  background-color: #f4f6f9;
`;

const EmptyText = styled.Text`
  font-size: 18px;
  text-align: center;
  margin-top: 50px;
  color: #777;
`;

const Card = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  elevation: 3;
`;

const InfoContainer = styled.View`
  flex: 1;
`;

const Name = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const Role = styled.Text`
  color: #666;
`;

const Phone = styled.Text`
  color: #444;
`;

const RemoveButton = styled.TouchableOpacity`
  background-color: #fa7474;
  padding: 8px 10px;
  border-radius: 8px;
`;

const RemoveText = styled.Text`
  color: white;
  font-weight: bold;
`;