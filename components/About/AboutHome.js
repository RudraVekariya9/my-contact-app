import React from "react";
import styled from "styled-components/native";
import { ScrollView } from "react-native";

export default function AboutHome() {
  return (
    <ScrollContent showsVerticalScrollIndicator={false}>
      <Card>
        <SectionTitle>Application</SectionTitle>
        <InfoText>My Contact App</InfoText>
        <InfoText>Version 1.0.0</InfoText>
        <InfoText>Build 2024.01</InfoText>
      </Card>

      <Card>
        <SectionTitle>Main Features</SectionTitle>
        <Bullet>• Contact List with Search</Bullet>
        <Bullet>• Drawer Navigation</Bullet>
        <Bullet>• Bottom Tab Navigation</Bullet>
        <Bullet>• Stack Navigation</Bullet>
        <Bullet>• Profile Section</Bullet>
      </Card>

      <Card>
        <SectionTitle>Description</SectionTitle>
        <Description>
          My Contact App is built using React Native and Expo.
          It demonstrates structured navigation using Drawer,
          Bottom Tabs, and Stack navigators working together.
        </Description>
      </Card>

      <Card>
        <SectionTitle>Developer</SectionTitle>
        <InfoText>Rudra Vekariya</InfoText>
        <InfoText>React Native Developer</InfoText>
        <InfoText>Email: rudra@gmail.com</InfoText>
      </Card>
    </ScrollContent>
  );
}

const ScrollContent = styled(ScrollView)`
  padding: 20px;
`;

const Card = styled.View`
  background-color: #ffffff;
  border-width: 1px;
  border-color: #e5e5e5;
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 15px;
  elevation: 2;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const InfoText = styled.Text`
  font-size: 14px;
  margin-bottom: 4px;
`;

const Description = styled.Text`
  font-size: 14px;
  line-height: 20px;
  color: #555;
`;

const Bullet = styled.Text`
  font-size: 14px;
  margin-bottom: 4px;
`;