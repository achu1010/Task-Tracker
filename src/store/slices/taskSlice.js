import { createSlice } from '@reduxjs/toolkit';
import { cancelTaskNotification, scheduleTaskNotification } from '../../utils/notifications';

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
        const oldTask = state.tasks[taskIndex];
        
        // Update the task
        state.tasks[taskIndex] = {
          ...oldTask,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        // Handle notification update if due date or reminder changed
        const newTask = state.tasks[taskIndex];
        
        // Cancel old notification if it exists
        if (oldTask.notificationId) {
          cancelTaskNotification(oldTask.id).catch(err => 
            console.error('Failed to cancel notification:', err)
          );
        }
        
        // Schedule new notification if needed
        if (newTask.dueDate && newTask.reminder?.enabled && !newTask.completed) {
          scheduleTaskNotification(
            newTask.id,
            newTask.title,
            newTask.description || 'Task due soon!',
            new Date(newTask.dueDate)
          )
            .then(notificationId => {
              if (notificationId) {
                state.tasks[taskIndex].notificationId = notificationId;
              }
            })
            .catch(err => console.error('Failed to schedule notification:', err));
        }
      }
    },
    
    deleteTask: (state, action) => {
      // Find the task to be deleted
      const taskToDelete = state.tasks.find(task => task.id === action.payload);
      
      // Cancel notification if it exists
      if (taskToDelete && taskToDelete.notificationId) {
        cancelTaskNotification(taskToDelete.id).catch(err => 
          console.error('Failed to cancel notification:', err)
        );
      }
      
      // Remove the task from state
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    
    toggleTaskComplete: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
        
        // Cancel notification if task is completed and has a notification
        if (task.completed && task.notificationId) {
          cancelTaskNotification(task.id).catch(err => 
            console.error('Failed to cancel notification:', err)
          );
          task.notificationId = null;
        } 
        // Reschedule notification if task is uncompleted, has due date and reminder
        else if (!task.completed && task.dueDate && task.reminder?.enabled) {
          const dueDate = new Date(task.dueDate);
          // Only schedule if due date is in the future
          if (dueDate > new Date()) {
            scheduleTaskNotification(
              task.id,
              task.title,
              task.description || 'Task due soon!',
              dueDate
            )
              .then(notificationId => {
                if (notificationId) {
                  task.notificationId = notificationId;
                }
              })
              .catch(err => console.error('Failed to schedule notification:', err));
          }
        }
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