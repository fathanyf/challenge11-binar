import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getDocs,
  collection,
  getDoc,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import {
  addDoc,
  doc,
  query,
  updateDoc,
  where,
  orderBy,
} from 'firebase/firestore';

export const get_games = () => {
  return (dispatch) => {
    const dbRef = collection(db, 'games');
    getDocs(dbRef)
      .then((snapshot) => {
        let result = [];
        snapshot.docs.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });
        console.log(result);
        dispatch(gamesData(result));
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

// export const get_game_board = () => {
//   return (dispatch) => {
//     const q = query(
//       collection(db, 'gamestats'),
//       orderBy('createdAt', 'desc'),
//       limit(5)
//     );
//     getDocs(q)
//       .then((Snapshot) => {
//         console.log('2. berhasil dapat data :', Snapshot.docs);
//         let gamestats = [];
//         Snapshot.docs.forEach((doc) => {
//           gamestats.push({ ...doc.data(), id: doc.id });
//         });
//         console.log(gamestats);
//         dispatch(gamesBoard(gamestats));
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
// };

export const get_game_board = (id) => {
  if (!id) return;

  return (dispatch) => {
    const q = query(collection(db, 'gamestats'), where('playerId', '==', id));
    getDocs(q)
      .then((snapshot) => {
        let result = [];
        snapshot.docs.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });
        console.log(result);
        dispatch(gamesBoard(result));
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getGameList = createAsyncThunk(
  'games/getGameList',
  async (uid) => {
    const dbRef = collection(db, 'games');
    const snapshot = await getDocs(dbRef);

    return snapshot.docs.reduce((a, c) => {
      const data = { ...c.data(), id: c.id };
      const user = c.data().users;

      a.push(!uid ? data : { ...data, isPlayed: user.includes(uid) });
      return a;
    }, []);
  }
);

export const quitAndSave = createAsyncThunk(
  'games/quitAndSave',
  async (data, thunkAPI) => {
    const updateGameStats = collection(db, 'gamestats');
    const updateGamePoint = doc(db, 'gamepoint', data.playerId);
    const getGamePoint = query(
      collection(db, 'gamepoint'),
      where('playerId', '==', data.playerId || '')
    );

    let totalpoint = null;

    const newGameStat = {
      playerId: data.playerId,
      point: data.point,
      playCount: data.playCount,
      userWin: data.userWin,
      userLoss: data.userLoss,
      userDraw: data.userDraw,
      name: data.name,
      avatar: data.avatar,
      createdAt: serverTimestamp(),
    };

    try {
      const snapshot = await getDocs(getGamePoint);
      const [doc] = snapshot.docs;

      totalpoint = doc.data().totalpoint;
    } catch (e) {
      throw new Error(e);
    }

    try {
      await getDocs(updateGameStats).then(() =>
        addDoc(updateGameStats, newGameStat)
      );
      await updateDoc(updateGamePoint, {
        name: data.name,
        avatar: data.avatar,
        totalpoint: data.point + +totalpoint,
      });
    } catch (error) {
      console.log(error);
    }

    try {
      const getGamesByQuery = query(
        collection(db, 'games'),
        where('link', '==', data.qstring)
      );
      const getUser = query(
        collection(db, 'users'),
        where('playerId', '==', data.playerId)
      );

      const snapshot = await getDocs(getGamesByQuery);
      const user = await getDocs(getUser);

      const [docs] = snapshot.docs;
      const gameData = docs.data();

      const uid = data.playerId;
      const gid = docs.id;

      if (!gameData.users.includes(uid)) {
        gameData.users.push(uid);
      }

      const result = gameData.users.filter((u) => u !== '');
      const getGameById = doc(db, 'games', gid);

      updateDoc(getGameById, { users: result });

      const [userDoc] = user.docs;
      const userData = userDoc.data();
      let gamesInUser = null;

      if (!userData.games || userData.games.length === 0) {
        gamesInUser = [gid];
      }

      if (userData.games && !userData.games.includes(gid)) {
        userData.games.push(gid);
      }

      updateDoc(doc(db, 'users', uid), { games: gamesInUser });
    } catch (error) {
      console.log(error);
    }

    data.router.push('/games');
  }
);

export const quitAndSaveDummy = createAsyncThunk(
  'games/quitAndSaveDummy',
  async (data, thunkAPI) => {
    try {
      const updateGameStats = collection(db, 'dummygame');

      const newGameStat = {
        name: data.name,
        playerId: data.playerId,
        point: data.point,
      };

      await getDocs(updateGameStats).then(() =>
        addDoc(updateGameStats, newGameStat)
      );
    } catch (error) {
      console.log(error);
    }

    try {
      const getGamesByQuerry = query(
        collection(db, 'games'),
        where('link', '==', data.qstring)
      );
      const getUser = query(
        collection(db, 'users'),
        where('playerId', '==', data.playerId)
      );

      const snapshot = await getDocs(getGamesByQuerry);
      const user = await getDocs(getUser);

      const [docs] = snapshot.docs;
      const gameData = docs.data();

      const uid = data.playerId;
      const gid = docs.id;

      console.log('gameData.users', data);

      if (!gameData.users.includes(uid)) {
        gameData.users.push(uid);
      }

      const result = gameData.users.filter((u) => u !== '');
      const getGameById = doc(db, 'games', gid);

      updateDoc(getGameById, { users: result });

      const [userDoc] = user.docs;
      const userData = userDoc.data();
      let gamesInUser = null;

      console.log('userData.games', userData.games);

      if (!userData.games || userData.games.length === 0) {
        gamesInUser = [gid];
      }

      if (userData.games && !userData.games.includes(gid)) {
        userData.games.push(gid);
      }

      updateDoc(doc(db, 'users', uid), { games: gamesInUser });
    } catch (error) {
      console.log(error);
    }

    data.router.push('/games');
  }
);

export const saveMemory = createAsyncThunk(
  'games/saveDummy',
  async (data, thunkAPI) => {
    try {
      const updateGameStats = collection(db, 'memorygame');

      const newGameStat = {
        name: data.name,
        playerId: data.playerId,
        point: data.point,
      };

      await getDocs(updateGameStats).then(() =>
        addDoc(updateGameStats, newGameStat)
      );
    } catch (error) {
      console.log(error);
    }

    try {
      const getGamesByQuerry = query(
        collection(db, 'games'),
        where('link', '==', data.qstring)
      );
      const getUser = query(
        collection(db, 'users'),
        where('playerId', '==', data.playerId)
      );

      const snapshot = await getDocs(getGamesByQuerry);
      const user = await getDocs(getUser);

      const [docs] = snapshot.docs;
      const gameData = docs.data();

      const uid = data.playerId;
      const gid = docs.id;

      console.log('gameData.users', data);

      if (!gameData.users.includes(uid)) {
        gameData.users.push(uid);
      }

      const result = gameData.users.filter((u) => u !== '');
      const getGameById = doc(db, 'games', gid);

      updateDoc(getGameById, { users: result });

      const [userDoc] = user.docs;
      const userData = userDoc.data();
      let gamesInUser = null;

      console.log('userData.games', userData.games);

      if (!userData.games || userData.games.length === 0) {
        gamesInUser = [gid];
      }

      if (userData.games && !userData.games.includes(gid)) {
        userData.games.push(gid);
      }

      updateDoc(doc(db, 'users', uid), { games: gamesInUser });
    } catch (error) {
      console.log(error);
    }

    data.router.push('/games');
  }
);

const initialState = {
  games: [],
  addGames: [],
  addDummyGames: [],
  addGameData: [],
  gamesBoard: [],
  loadingGames: true,
  loadingGamesBoard: true,
  errorGamesStats: true,
};

export const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    gamesData(state, action) {
      state.games = action.payload;
      state.loadingGames = false;
    },
    gamesBoard(state, action) {
      state.gamesBoard = action.payload;
      state.loadingGamesBoard = false;
      state.errorGamesStats = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(quitAndSave.fulfilled, () => {});
    builder.addCase(getGameList.fulfilled, (state, action) => {
      state.games = action.payload;
    });
  },
});

export const { gamesData, gamesBoard } = gamesSlice.actions;
export default gamesSlice.reducer;
