import '../../styles/custom.css';
import '../../styles/globals.css';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/route-components/ProtectedRoute';
import Navbar from '../components/main-components/Navbar';
import Toast from '../components/toast-components/ToastContainer';
import { store } from '../store';
import { Provider } from 'react-redux';

const noAuth = ['/', '/auth/signin', '/auth/signup'];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Provider store={store}>
        <Toast />
        {noAuth.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <ProtectedRoute>
            <Navbar />
            <Component {...pageProps} />
          </ProtectedRoute>
        )}
      </Provider>
    </>
  );
}

export default MyApp;
