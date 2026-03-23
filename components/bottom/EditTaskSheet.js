import React from "react";
import styled from "styled-components/native";
import BottomSheet from "./BottomSheet";

const EditTaskSheet = ({
  visible,
  task,
  setTask,
  updateTask,
  closeSheet
}) => {

  return (
    <BottomSheet visible={visible} closeSheet={closeSheet}>

      <Title>Edit Task</Title>

      <Input
        placeholder="Edit Task"
        value={task}
        onChangeText={setTask}
      />

      <ButtonRow>

        <AddButton
          onPress={() => {
            updateTask();
            closeSheet();
          }}
        >
          <ButtonText>Update</ButtonText>
        </AddButton>

        <CancelButton onPress={closeSheet}>
          <CancelText>Cancel</CancelText>
        </CancelButton>

      </ButtonRow>

    </BottomSheet>
  );
};

export default EditTaskSheet;


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

const ButtonRow = styled.View`
  flex-direction:row;
  justify-content:space-between;
`;

const AddButton = styled.TouchableOpacity`
  background:#0b74e5;
  padding:10px 20px;
  border-radius:8px;
`;

const CancelButton = styled.TouchableOpacity`
  background:#ccc;
  padding:10px 20px;
  border-radius:8px;
`;

const ButtonText = styled.Text`
  color:white;
  font-weight:bold;
`;

const CancelText = styled.Text`
  font-weight:bold;
`;