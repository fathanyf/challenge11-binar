import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  win: 0,
  loss: 0,
  draw: 0,
  score: 0,
};

const matchPoint = createSlice({
  name: 'matchPoint',
  initialState,
  reducers: {
    totalWin: (state) => {
      state.win += 1;
    },
    totalLoss: (state) => {
      state.loss += 1;
    },
    totalDraw: (state) => {
      state.draw += 1;
    },
    totalScore: (state, action) => {
      state.score = action.payload;
    },
    totalReset: (state) => {
      state.win = 0;
      state.loss = 0;
      state.draw = 0;
      state.score = 0;
    },
    randomizeNumber: (state) => {
      state.score = Math.floor(Math.random() * 10);
    },
  },
});

export const {
  totalWin,
  totalDraw,
  totalLoss,
  totalScore,
  totalReset,
  randomizeNumber,
} = matchPoint.actions;
export default matchPoint.reducer;
