import { configureStore } from '@reduxjs/toolkit';
import userReducer from './users/UserSlice';
import profileReducer from './profile/ProfileSlice';
import playerReducer from './players/PlayerSlice';
import gameReducer from './games/GamesSlice';
import pointReducer from './point/PointSlicer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    profile: profileReducer,
    player: playerReducer,
    games: gameReducer,
    pointReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
