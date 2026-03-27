import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "./BackButton";
export default function Header({title, showBack = true}) {
  const navigation = useNavigation();

  return (
    <SafeContainer>
      <HeaderRow>
        {showBack ? <BackButton /> : <RightSpace />}
            <Title>{title}</Title>
        <RightSpace />
      </HeaderRow>
    </SafeContainer>
  );
}

const SafeContainer = styled(SafeAreaView)`
  background-color: #0b74e5;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
`;

const RightSpace = styled.View`
  width: 40px;
`;