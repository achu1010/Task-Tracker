import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  categories: ['Personal', 'Work', 'Study', 'Health', 'Shopping'],
  searchQuery: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  filterBy: {},
  isLoading: false,
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: action.payload.subtasks || [],
        comments: [],
      };
      state.tasks.unshift(newTask);
    },
    
    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    
    toggleTaskComplete: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
      }
    },
    
    addSubTask: (state, action) => {
      const { taskId, title } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        const subTask = {
          id: Date.now().toString(),
          title,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        task.subtasks.push(subTask);
        task.updatedAt = new Date().toISOString();
      }
    },
    
    toggleSubTaskComplete: (state, action) => {
      const { taskId, subTaskId } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        const subTask = task.subtasks.find(st => st.id === subTaskId);
        if (subTask) {
          subTask.completed = !subTask.completed;
          task.updatedAt = new Date().toISOString();
        }
      }
    },
    
    addComment: (state, action) => {
      const { taskId, text, author } = action.payload;
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        const comment = {
          id: Date.now().toString(),
          text,
          author,
          createdAt: new Date().toISOString(),
        };
        task.comments.push(comment);
        task.updatedAt = new Date().toISOString();
      }
    },
    
    addCategory: (state, action) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
    
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    setSortBy: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    
    setFilterBy: (state, action) => {
      state.filterBy = action.payload;
    },
    
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    
    reorderTasks: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.tasks.splice(fromIndex, 1);
      state.tasks.splice(toIndex, 0, removed);
    },
    
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  addSubTask,
  toggleSubTaskComplete,
  addComment,
  addCategory,
  setSearchQuery,
  setSortBy,
  setFilterBy,
  setSelectedTask,
  reorderTasks,
  setTasks,
  setLoading,
} = taskSlice.actions;

export default taskSlice.reducer;