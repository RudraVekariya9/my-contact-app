import React from "react";
import styled from "styled-components/native";

import FavHome from "../components/Favorite/FavHome";
import Header from "../components/shared/Header";
import { ContactProvider } from "../context/ContactContext";

export default function FavoriteScreen() {
   
  return (
      <Container>
        <Header title="Favorite" showBack={false} />
        <FavHome />
      </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;