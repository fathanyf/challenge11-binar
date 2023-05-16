import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDm7l4CW9g-cI8NkhGQNgscymbh4UBY9dw',
  authDomain: 'binar-ch10-v1.firebaseapp.com',
  projectId: 'binar-ch10-v1',
  storageBucket: 'binar-ch10-v1.appspot.com',
  messagingSenderId: '71450586076',
  appId: '1:71450586076:web:24068f89e06ae36ace3d19',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
