import React, { useState } from "react";
import styled from "styled-components/native";
import { Image, ScrollView, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import * as Clipboard from "expo-clipboard";

export default function ScanHome() {
  const [images, setImages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((item) => item.uri);
      setImages(uris);
      processImages(uris);
    }
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const newImages = [...images, uri];
      setImages(newImages);
      processImages(newImages);
    }
  };

  const processImages = async (uris) => {
    setLoading(true);
    setText("");

    try {
      let finalText = "";

      for (let i = 0; i < uris.length; i++) {
        const res = await TextRecognition.recognize(uris[i]);
        finalText += `\n--- Page ${i + 1} ---\n${res.text}\n`;
      }

      setText(finalText);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const resetScan = () => {
    setImages([]);
    setText("");
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(text);
    alert("Text copied");
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>

        <Title>Document Scanner</Title>

        <ButtonRow>
          <Button onPress={pickImage}>
            <ButtonText>Gallery</ButtonText>
          </Button>

          <Button onPress={openCamera}>
            <ButtonText>Camera</ButtonText>
          </Button>
        </ButtonRow>

        {images.length > 0 && (
          <HorizontalScroll horizontal>
            {images.map((img, index) => (
              <PreviewImage key={index} source={{ uri: img }} />
            ))}
          </HorizontalScroll>
        )}

        {images.length > 0 && (
          <DeleteButton onPress={resetScan}>
            <DeleteText>Scan Again</DeleteText>
          </DeleteButton>
        )}

        {loading && <Loader size="large" color="#0b74e5" />}

        {text !== "" && !loading && (
          <ResultBox>
            <ResultTitle>Extracted Text</ResultTitle>
            <ResultText>{text}</ResultText>

            <CopyButton onPress={copyToClipboard}>
              <CopyText>Copy Text</CopyText>
            </CopyButton>
          </ResultBox>
        )}

      </ScrollView>
    </Container>
  );
}

/* ---------- STYLES ---------- */

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Button = styled.TouchableOpacity`
  flex: 1;
  background-color: #0b74e5;
  padding: 14px;
  border-radius: 10px;
  align-items: center;
  margin-horizontal: 5px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const HorizontalScroll = styled(ScrollView)`
  margin-top: 20px;
`;

const PreviewImage = styled(Image)`
  width: 120px;
  height: 120px;
  margin-right: 10px;
  border-radius: 10px;
`;

const DeleteButton = styled.TouchableOpacity`
  margin-top: 15px;
  background-color: #ff4d4d;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const DeleteText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const Loader = styled(ActivityIndicator)`
  margin-top: 20px;
`;

const ResultBox = styled.View`
  margin-top: 20px;
  padding: 15px;
  background-color: #f2f8ff;
  border-radius: 10px;
`;

const ResultTitle = styled.Text`
  font-weight: bold;
  margin-bottom: 10px;
`;

const ResultText = styled.Text`
  line-height: 20px;
`;

const CopyButton = styled.TouchableOpacity`
  margin-top: 15px;
  background-color: #28a745;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const CopyText = styled.Text`
  color: #fff;
  font-weight: bold;
`;