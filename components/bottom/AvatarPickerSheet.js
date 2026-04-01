import React from "react";
import styled from "styled-components/native";
import BottomSheet from "./BottomSheet";
import { Image, TouchableOpacity } from "react-native";
import { avatars } from "../../Data/avatars";

export default function AvatarPickerSheet({ visible, onClose, onSelect, selectedIndex }) {

  return (
    <BottomSheet visible={visible} closeSheet={onClose}>

      <Title>Select Avatar</Title>

      <Grid>
        {avatars.map((avatar, index) => (
        <AvatarItem
            key={index}
            onPress={() => onSelect(index)}
            isSelected={index === selectedIndex} 
        >
            <AvatarImage source={avatar} />
        </AvatarItem>
        ))}
      </Grid>

    </BottomSheet>
  );
}

/* styles */

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const AvatarItem = styled.TouchableOpacity`
  width: 30%;
  margin-bottom: 15px;
  border-width: 3px;
  border-color: ${props => props.isSelected ? "#0b74e5" : "transparent"};
  border-radius: 50px;
  padding: 3px;
`;
const AvatarImage = styled(Image)`
  width: 100%;
  height: 100px;
  border-radius: 50px;
`;