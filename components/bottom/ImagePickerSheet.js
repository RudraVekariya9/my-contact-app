import React from "react";
import styled from "styled-components/native";
import BottomSheet from "./BottomSheet"; 
import { Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function ImagePickerSheet({
  visible,
  onClose,
  onCamera,
  onGallery,
  onAvatar,
  onRemove,
}) {
  return (
    <BottomSheet visible={visible} closeSheet={onClose}>

      {/* HEADER */}
      <HeaderRow>

        <IconButton onPress={onClose}>
          <Ionicons name="close" size={26} color="#000" />
        </IconButton>

        <Title>Profile Picture</Title>

        <IconButton onPress={onRemove}>
          <MaterialIcons name="delete-outline" size={26} color="#ff3b30" />
        </IconButton>

      </HeaderRow>

      <Option onPress={onCamera}>
        <Row>
          <Icon source={require("../../assets/icons/camera.png")} />
          <Text>Camera</Text>
        </Row>
      </Option>

      <Divider />

      <Option onPress={onGallery}>
        <Row>
          <Icon source={require("../../assets/icons/gallery.png")} />
          <Text>Gallery</Text>
        </Row>
      </Option>

      <Divider />

      <Option onPress={onAvatar}>
        <Row>
          <Icon source={require("../../assets/icons/avatar.png")} />
          <Text>Avatar</Text>
        </Row>
      </Option>

    </BottomSheet>
  );
}

/* ---------- STYLES ---------- */

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const IconButton = styled.TouchableOpacity`
  padding: 5px;
  border-radius: 20px;
`;

const Option = styled.TouchableOpacity`
  padding: 15px 0;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Icon = styled(Image)`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const Text = styled.Text`
  font-size: 16px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #eee;
`;