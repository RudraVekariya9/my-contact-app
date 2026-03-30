import React from "react";
import styled from "styled-components/native";
import HomeHeader from "../components/home/HomeHeader";
import ContactList from "../components/home/ContactList";


export default function HomeScreen() {
  return (
      <Container>
        <HomeHeader />
        <ContactList />
      </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #f4f6f9;
`;