import React from "react";
import styled from "styled-components/native";
import Header from "../components/shared/Header";
import NotificationHome from "../components/Notification/NotificationHome";

export default function NotificationScreen() {
  return (
    <Container>
      <Header title="Notifications" showBack={false}/>
      <NotificationHome />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;