import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light', // 'light' | 'dark' | 'auto'
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
    reminders: true,
    deadlines: true,
  },
  view: {
    defaultView: 'list', // 'list' | 'calendar' | 'kanban'
    showCompleted: true,
    groupByCategory: false,
    compactMode: false,
  },
  productivity: {
    pomodoroTimer: 25, // minutes
    shortBreak: 5, // minutes
    longBreak: 15, // minutes
    autoStartBreaks: false,
    autoStartPomodoros: false,
  },
  sync: {
    autoSync: true,
    syncInterval: 300, // seconds
    offlineMode: false,
  },
  privacy: {
    analytics: true,
    crashReports: true,
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    
    updateNotificationSettings: (state, action) => {
      state.notifications = {
        ...state.notifications,
        ...action.payload,
      };
    },
    
    updateViewSettings: (state, action) => {
      state.view = {
        ...state.view,
        ...action.payload,
      };
    },
    
    updateProductivitySettings: (state, action) => {
      state.productivity = {
        ...state.productivity,
        ...action.payload,
      };
    },
    
    updateSyncSettings: (state, action) => {
      state.sync = {
        ...state.sync,
        ...action.payload,
      };
    },
    
    updatePrivacySettings: (state, action) => {
      state.privacy = {
        ...state.privacy,
        ...action.payload,
      };
    },
    
    resetSettings: () => {
      return initialState;
    },
  },
});

export const {
  setTheme,
  updateNotificationSettings,
  updateViewSettings,
  updateProductivitySettings,
  updateSyncSettings,
  updatePrivacySettings,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;