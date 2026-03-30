import React from "react";
import styled from "styled-components/native";

import Header from "../components/shared/Header";
import SettingHome from "../components/Setting/SettingHome";

export default function SettingScreen() {
  return (
    <Container>
      <Header title="Settings" />
      <SettingHome />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #f4f6f9;
`;