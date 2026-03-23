import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useContactContext } from "../../context/ContactContext";

export default function HomeHeader() {
  const navigation = useNavigation();
  const { searchTerm, setSearchTerm } = useContactContext();

  return (
    <Container edges={["top"]}>

      <TopRow>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Ionicons name="menu" size={26} color="#ffffff" />
          </TouchableOpacity>

          <Title>My Contact App</Title>

          <TouchableOpacity onPress={() => navigation.navigate("FavoriteScreen")}>
            <Ionicons name="heart-outline" size={26} color="#ffffff" />
          </TouchableOpacity>
      </TopRow>

      <SearchInput
        placeholder="Search contact..."
        placeholderTextColor="#ccc"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
    </Container>
  );
}

const Container = styled(SafeAreaView)`
  background-color: #0b74e5;
  padding: 10px;
`;

const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
`;

const SearchInput = styled.TextInput`
  background-color: white;
  padding: 12px 18px;
  border-radius: 25px;
  font-size: 16px;
  elevation: 3;
`;