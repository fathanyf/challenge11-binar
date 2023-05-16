import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export const fetchUserGame = createAsyncThunk(
  'auth/fetchUserGame',
  async (uid, thunkAPI) => {
    const userDocRef = doc(db, 'users', uid);
    const response = await getDoc(userDocRef);
    const data = response.data();

    return {
      ...data,
      createdAt: {
        nanoseconds: data.createdAt.nanoseconds + '',
        seconds: data.createdAt.seconds + '',
      },
    };
  }
);

export const fetchUserGamePoint = createAsyncThunk(
  'auth/fetchUserGamePoint',
  async (uid, thunkAPI) => {
    const queries = query(
      collection(db, 'gamepoint'),
      where('playerId', '==', uid || '')
    );
    try {
      const snapshot = await getDocs(queries);

      const [doc] = snapshot.docs;
      const data = doc.data();

      return {
        ...data,
        // updatedAt: {
        //   nanoseconds: data.updatedAt.nanoseconds + '',
        //   seconds: data.updatedAt.seconds + '',
        // }
      };
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchOtherUserGamePoint = createAsyncThunk(
  'auth/fetchOtherUserGamePoint',
  async (id) => {
    const queries = query(
      collection(db, 'gamepoint'),
      where('playerId', '==', id || '')
    );

    try {
      const snapshot = await getDocs(queries);

      const [doc] = snapshot.docs;
      const data = doc.data();
      console.log(data);

      return {
        ...data,
        // updatedAt: {
        //   nanoseconds: data.updatedAt.nanoseconds + '',
        //   seconds: data.updatedAt.seconds + '',
        // }
      };
    } catch (error) {
      console.log(error);
    }
  }
);

export const userSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    data: {
      address: '',
      avatar: '',
      createdAt: '',
      name: '',
      phone: '',
      playerId: '',
    },
    data2: {
      avatar: '',
      name: '',
      playerId: '',
      totalpoint: '',
      updatedAt: '',
    },
    id: '',
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    register: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    getUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserGame.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(fetchUserGamePoint.fulfilled, (state, action) => {
      state.data2 = action.payload;
    });
    builder.addCase(fetchOtherUserGamePoint.fulfilled, (state, action) => {
      state.data2 = action.payload;
    });
  },
});

export const { login, logout, register, getUser } = userSlice.actions;

// selectors
export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
