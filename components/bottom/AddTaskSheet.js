import React from "react";
import styled from "styled-components/native";
import BottomSheet from "./BottomSheet";
import { useState } from "react";

const AddTaskSheet = ({ visible, task, setTask, addTask, closeSheet }) => {
const [error, setError] = useState("");

  return (
    <BottomSheet visible={visible} closeSheet={closeSheet}>

      <Title>Add New Task</Title>

      <Input
        placeholder="Enter Task"
        value={task}
        onChangeText={(text) => {
          setTask(text);
          setError("");
        }}
      />

      {error !== "" && (
        <ErrorText>{error}</ErrorText>
      )}

      <ButtonRow>

        <AddButton
          onPress={() => {

            const trimmedTask = task.trim();

            if (trimmedTask === "") {
              setError("Task title cannot be empty");
              return;
            }

            setError("");
            addTask();
            closeSheet();

          }}
        >
          <ButtonText>Add</ButtonText>
        </AddButton>

        <CancelButton onPress={closeSheet}>
          <CancelText>Cancel</CancelText>
        </CancelButton>

      </ButtonRow>

    </BottomSheet>
  );
};

export default AddTaskSheet;


/* styles */

const Title = styled.Text`
  font-size:18px;
  font-weight:bold;
  margin-bottom:15px;
`;

const Input = styled.TextInput`
  border-width:1px;
  border-color:#ddd;
  border-radius:10px;
  padding:10px;
  margin-bottom:15px;
`;

const ButtonText = styled.Text`
  color:white;
  font-weight:bold;
`;

const ErrorText = styled.Text`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;
const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const CancelButton = styled.TouchableOpacity`
  background:#ccc;
  padding:10px 20px;
  border-radius:8px;
`;

const CancelText = styled.Text`
  color: #333;
  font-weight: bold;
`;

const AddButton = styled.TouchableOpacity`
  background : #0b74e5;
  padding:10px 20px;
  border-radius:8px;
`;