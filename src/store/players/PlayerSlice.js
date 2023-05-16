import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { createSlice } from '@reduxjs/toolkit';

export const get_leader_board = (id) => {
  return (dispatch) => {
    const q = query(
      collection(db, 'gamepoint'),
      orderBy('totalpoint', 'desc'),
      limit(3)
    );
    getDocs(q)
      .then((Snapshot) => {
        let gamestats = [];
        Snapshot.docs.forEach((doc) => {
          gamestats.push({ ...doc.data(), id: doc.id });
        });
        dispatch(leaderBoard(gamestats));
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const get_player = () => {
  return (dispatch) => {
    const dbRef = query(collection(db, 'users'), limit(5));
    getDocs(dbRef)
      .then((snapshot) => {
        let users = [];
        snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        dispatch(playerData(users));
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const playerSlice = createSlice({
  name: 'player',
  initialState: {
    leaderBoard: [],
    playerData: [],
    loadingleaderBoard: true,
    loadingPlayerData: true,
  },
  reducers: {
    leaderBoard(state, action) {
      state.leaderBoard = action.payload;
      state.loadingleaderBoard = false;
    },
    playerData(state, action) {
      state.playerData = action.payload;
      state.loadingPlayerData = false;
    },
  },
});

export const { leaderBoard, playerData } = playerSlice.actions;
export default playerSlice.reducer;
