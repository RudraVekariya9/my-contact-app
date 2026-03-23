import React from "react";
import styled from "styled-components/native";

import HelpHome from "../components/help/HelpHome";
import Header from "../components/shared/Header";

export default function HelpScreen() {
  return (
    <Container>
      <Header title = "Help" />
      <HelpHome />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;