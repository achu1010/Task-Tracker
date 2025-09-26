import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  collaborators: [],
  currentUser: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    
    updateUserPreferences: (state, action) => {
      if (state.currentUser) {
        state.currentUser.preferences = {
          ...state.currentUser.preferences,
          ...action.payload,
        };
      }
    },
    
    updateUserStats: (state, action) => {
      if (state.currentUser) {
        state.currentUser.stats = {
          ...state.currentUser.stats,
          ...action.payload,
        };
      }
    },
    
    addBadge: (state, action) => {
      if (state.currentUser && !state.currentUser.stats.badges.includes(action.payload)) {
        state.currentUser.stats.badges.push(action.payload);
      }
    },
    
    incrementStreak: (state) => {
      if (state.currentUser) {
        state.currentUser.stats.streak += 1;
        state.currentUser.stats.points += 10; // 10 points per day streak
      }
    },
    
    setCollaborators: (state, action) => {
      state.collaborators = action.payload;
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setUser,
  logout,
  updateUserPreferences,
  updateUserStats,
  addBadge,
  incrementStreak,
  setCollaborators,
  setLoading,
} = userSlice.actions;

export default userSlice.reducer;