import React from 'react';
import styled from 'styled-components/native';
import Header from "../components/shared/Header";
import PaginationHome from '../components/pagination/PaginationHome';

export default function PaginationScreen() {
  return (
    <Container>
      <Header title="Pagination"/>
      <PaginationHome />
    </Container>
  );
}
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;