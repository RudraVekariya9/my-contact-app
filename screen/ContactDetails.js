import React from "react";
import styled from "styled-components/native";
import Header from "../components/shared/Header";
import ContactDetailHome from "../components/ContactDetail/ContactDetailHome";

export default function ContactDetails({ route }) {
  return (
    <Container>
      <Header title="Contact Details" />
      <ContactDetailHome route={route} />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;