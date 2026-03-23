import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todos",

  initialState: {
    tasks: []
  },

  reducers: {

    setTasks: (state, action) => {
      state.tasks = action.payload;
    },

    addTask: (state, action) => {
      const newTask = {
        title: action.payload,
        completed: false
      };

      state.tasks.unshift(newTask);
    },

    toggleTask: (state, action) => {

      const index = action.payload;

      if (state.tasks[index]) {
        state.tasks[index].completed =
          !state.tasks[index].completed;
      }

    },

    deleteTask: (state, action) => {

      const index = action.payload;

      if (state.tasks[index]) {
        state.tasks.splice(index, 1);
      }

    }

  }
});

export const { setTasks, addTask, toggleTask, deleteTask } =
  todoSlice.actions;

export default todoSlice.reducer;