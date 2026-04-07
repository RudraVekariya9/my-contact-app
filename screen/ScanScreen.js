import React from "react";
import styled from "styled-components/native";
import Header from "../components/shared/Header";
import ScanHome from "../components/Scan/ScanHome";

export default function ScanScreen() {
  return (
    <Container>
      <Header title="Scan" />
      <ScanHome />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;