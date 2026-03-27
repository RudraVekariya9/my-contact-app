import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

import { db, auth } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";

import AddTaskSheet from "../bottom/AddTaskSheet";
import EditTaskSheet from "../bottom/EditTaskSheet";
import DeleteTaskSheet from "../bottom/DeleteTaskSheet";
import ActionPopup from "../popup/ActionPopup";
import { scheduleTodoNotification } from "../../services/notifications/notificationHelper";

const TodoHome = () => {

  const [task, setTask] = useState("");
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState([]);

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");



  /* LOAD TASKS FROM FIREBASE */

  useEffect(() => {

    const user = auth.currentUser;
    if (!user) return;

    const tasksRef = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {

      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setTasks(taskList);

    });

    return () => unsubscribe();

  }, []);



  /* ADD TASK */

  const addTask = async () => {

    const trimmedTask = task.trim();

    if (trimmedTask === "") {
      showPopup("Task title cannot be empty");
      return;
    }

    try {

      const user = auth.currentUser;

      await addDoc(
        collection(db, "users", user.uid, "tasks"),
        {
          title: trimmedTask,
          completed: false,
          createdAt: new Date()
        }
      );

      setTask("");
      showPopup("Task added successfully");

    } catch (error) {
      console.log(error);
    }

  };



  /* UPDATE TASK */

  const updateTask = async () => {

    const trimmedTask = task.trim();
    if (trimmedTask === "") return;

    try {

      const user = auth.currentUser;

      const taskRef = doc(
        db,
        "users",
        user.uid,
        "tasks",
        editId
      );

      await updateDoc(taskRef, {
        title: trimmedTask
      });

      setEditId(null);
      setTask("");

      showPopup("Task updated successfully");

    } catch (error) {
      console.log(error);
    }

  };



  /* TOGGLE TASK */

  const toggleTask = async (item) => {
      try {
        const user = auth.currentUser;

        const taskRef = doc(
          db,
          "users",
          user.uid,
          "tasks",
          item.id
        );

        const newStatus = !item.completed;

        await updateDoc(taskRef, {
          completed: newStatus
        });

        // 🔔 Schedule notification after 5 min
        if (newStatus) {
          await scheduleTodoNotification(item.title);
        }

      } catch (error) {
        console.log(error);
      }
    };



  /* DELETE TASK */

  const deleteTask = (item) => {

    setDeleteId(item.id);
    setShowDeleteSheet(true);

  };



  const confirmDelete = async () => {

    try {

      const user = auth.currentUser;

      const taskRef = doc(
        db,
        "users",
        user.uid,
        "tasks",
        deleteId
      );

      await deleteDoc(taskRef);

      setDeleteId(null);

      showPopup("Task deleted successfully");

    } catch (error) {
      console.log(error);
    }

  };



  /* EDIT TASK */

  const editTask = (item) => {

    setTask(item.title);
    setEditId(item.id);
    setShowEditSheet(true);

  };



  const filteredTasks = tasks.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );



  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
  };



  return (

    <Container>

      <SearchContainer>

        <View>
          <Ionicons name="search" size={20} color="gray" />
        </View>

        <SearchInput
          placeholder="Search task..."
          value={search}
          onChangeText={setSearch}
        />

      </SearchContainer>



      <AddNewTaskButton
        onPress={() => {
          setTask("");
          setShowAddSheet(true);
        }}
      >
        <AddNewTaskText>Add New Task</AddNewTaskText>
      </AddNewTaskButton>



      <ScrollView showsVerticalScrollIndicator={false}>

        <TaskList>

          {filteredTasks.map((item) => (

            <TaskItem key={item.id}>

              <TaskText completed={item.completed}>
                {item.title}
              </TaskText>

              <IconBox>

                <IconButton onPress={() => toggleTask(item)}>
                  <Ionicons
                    name="checkmark"
                    size={22}
                    color={item.completed ? "#0b74e5" : "#bbb"}
                  />
                </IconButton>

                <IconButton onPress={() => editTask(item)}>
                  <Ionicons
                    name="create-outline"
                    size={22}
                    color="#0b74e5"
                  />
                </IconButton>

                <IconButton onPress={() => deleteTask(item)}>
                  <Ionicons
                    name="close"
                    size={22}
                    color="red"
                  />
                </IconButton>

              </IconBox>

            </TaskItem>

          ))}

        </TaskList>

      </ScrollView>



      <AddTaskSheet
        visible={showAddSheet}
        task={task}
        setTask={setTask}
        addTask={addTask}
        closeSheet={() => setShowAddSheet(false)}
      />



      <EditTaskSheet
        visible={showEditSheet}
        task={task}
        setTask={setTask}
        updateTask={updateTask}
        closeSheet={() => setShowEditSheet(false)}
      />



      <DeleteTaskSheet
        visible={showDeleteSheet}
        confirmDelete={confirmDelete}
        closeSheet={() => setShowDeleteSheet(false)}
      />



      <ActionPopup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />

    </Container>

  );

};

export default TodoHome;



/* styles remain EXACTLY same */

const Container = styled.View`
  flex: 1;
  background-color: #f5f6fa;
  padding: 20px;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  height: 48px;
  padding: 0px 15px;
  margin-bottom: 16px;
  width: 100%;
  border-width: 1px;
  border-color: #e0e0e0;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  margin-left: 10px;
  font-size: 15px;
  color: #333;
`;

const AddNewTaskButton = styled.TouchableOpacity`
  background-color: #0b74e5;
  height: 48px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  width: 100%;
`;

const AddNewTaskText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

const TaskList = styled.View``;

const TaskItem = styled.View`
  background-color: #ffffff;
  min-height: 48px;
  padding: 12px 15px;
  border-radius: 12px;
  margin-bottom: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-width: 1px;
  border-color: #eaeaea;
`;

const TaskText = styled.Text`
  font-size: 16px;
  flex: 1;
  color: #333;
  text-decoration-line: ${(props) =>
    props.completed ? "line-through" : "none"};
`;

const IconBox = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
`;

const IconButton = styled.TouchableOpacity`
  margin-left: 12px;
`;