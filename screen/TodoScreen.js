import React from "react";
import styled from "styled-components/native";

import TodoHome from "../components/To-Do/TodoHome";
import Header from "../components/shared/Header";
import { TodoProvider } from "../context/TodoContext";

const TodoScreen = ({ navigation }) => {
  return (
    <TodoProvider>
      <Container>
        <Header title="To-Do" />
        <TodoHome navigation={navigation} />
      </Container>
    </TodoProvider>
  );
};

export default TodoScreen;

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;