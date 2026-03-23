import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.log("Error saving tasks", error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");

      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log("Error loading tasks", error);
    }
  };

  const addTask = (title) => {

    const trimmedTask = title.trim();
    if (trimmedTask === "") return;

    const newTask = {
      title: trimmedTask,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (index) => {

    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;

    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {

    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <TodoContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}; 