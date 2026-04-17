import React from "react";
import styled from "styled-components/native";

import MapHome from "../components/map/MapHome";
import Header from "../components/shared/Header";

export default function MapScreen() {
  return (
    <Container>
      <Header title = "Map" />
      <MapHome />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;