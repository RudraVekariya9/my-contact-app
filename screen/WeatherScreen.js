import React from "react";
import styled from "styled-components/native";

import Header from "../components/shared/Header";
import WeatherHome from "../components/weather/WeatherHome";

export default function WeatherScreen() {
  return (
    <Container>
      <Header title="Weather" />
      <WeatherHome />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #f4f6f9;
`;