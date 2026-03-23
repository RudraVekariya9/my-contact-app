import React from "react";
import styled from "styled-components/native";
import Header from "../components/shared/Header";
import AboutHome from "../components/About/AboutHome";

export default function AboutScreen() {
  return (
    <Container>
      <Header title="About" />
      <AboutHome />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;