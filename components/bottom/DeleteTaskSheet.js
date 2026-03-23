import React from "react";
import styled from "styled-components/native";
import BottomSheet from "./BottomSheet";

const DeleteTaskSheet = ({
  visible,
  confirmDelete,
  closeSheet
}) => {

  return (
    <BottomSheet visible={visible} closeSheet={closeSheet}>

      <Title>Delete Task</Title>

      <Message>
        Are you sure you want to delete this task?
      </Message>

      <ButtonRow>

        <DeleteButton
          onPress={() => {
            confirmDelete();
            closeSheet();
          }}
        >
          <DeleteText>Delete</DeleteText>
        </DeleteButton>

        <CancelButton onPress={closeSheet}>
          <CancelText>Cancel</CancelText>
        </CancelButton>

      </ButtonRow>

    </BottomSheet>
  );
};

export default DeleteTaskSheet;


/* styles */

const Title = styled.Text`
  font-size:18px;
  font-weight:bold;
  margin-bottom:10px;
`;

const Message = styled.Text`
  font-size:15px;
  margin-bottom:20px;
`;

const ButtonRow = styled.View`
  flex-direction:row;
  justify-content:space-between;
`;

const DeleteButton = styled.TouchableOpacity`
  background:red;
  padding:10px 20px;
  border-radius:8px;
`;

const CancelButton = styled.TouchableOpacity`
  background:#ccc;
  padding:10px 20px;
  border-radius:8px;
`;

const DeleteText = styled.Text`
  color:white;
  font-weight:bold;
`;

const CancelText = styled.Text`
  font-weight:bold;
`;