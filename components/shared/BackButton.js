import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function BackButton({ color = "#ffffff" }) {
  const navigation = useNavigation();

  return (
    <Button onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back" size={26} color={color} />
    </Button>
  );
}

const Button = styled(TouchableOpacity)`
  padding: 5px;
`;