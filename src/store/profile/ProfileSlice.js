import { createSlice } from '@reduxjs/toolkit';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const get_profile_data = (id) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        dispatch(profileData(docSnap.data()));
      }
    };
    fetchData();
  };
};

export const get_current_profile = (id) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        dispatch(currentProfile(docSnap.data()));
      }
    };

    fetchData();
  };
};

export const get_total_point = (id) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const docRef = doc(db, 'gamepoint', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        dispatch(getPoint(docSnap.data()));
      }
    };
    fetchData();
  };
};

export const update_profile_data = (data) => {
  return (dispatch) => {
    const userUpdateRef = doc(db, 'users', data.id);
    let updateUser = {
      id: data.id,
      name: data.name,
      address: data.address,
      phone: data.phone,
      avatar: data.avatar,
    };
    updateDoc(userUpdateRef, updateUser)
      .then(() => {
        dispatch(updateProfileData(updateUser));
        console.log(updateUser);
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

const initialState = {
  profile: '',
  isLoadingProfile: true,
  point: '',
  isLoadingPoint: true,
  updateProfile: '',
  isLoadingUpdateProfile: true,
  currentProfile: '',
  isLoadingCurrentProfile: true,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    profileData(state, action) {
      state.profile = action.payload;
      state.isLoadingProfile = false;
    },
    getPoint(state, action) {
      state.point = action.payload;
      state.isLoadingPoint = false;
    },
    updateProfileData(state, action) {
      state.updateProfile = action.payload;
      state.isLoadingUpdateProfile = false;
    },
    currentProfile(state, action) {
      state.currentProfile = action.payload;
      state.isLoadingCurrentProfile = false;
    },
  },
});

export const { profileData, getPoint, updateProfileData, currentProfile } =
  profileSlice.actions;
export default profileSlice.reducer;
