import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../config/firebase';
import { login, selectUser } from '../../store/users/UserSlice';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth/signin');
      }
      if (user) {
        dispatch(
          login({
            email: user.email,
            uid: user.uid,
          })
        );
      }
      return children;
    });
  }, [dispatch, children, router]);

  if (!user) {
    return;
  }
  return children;
};

export default ProtectedRoute;
