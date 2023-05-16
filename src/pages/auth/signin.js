import Head from 'next/head';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../../config/firebase';
import { login } from '../../store/users/UserSlice';
import { toast } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from '../../store';

const SigninWrapper = () => {
  return (
    <Provider store={store}>
      <Signin />
    </Provider>
  );
};

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        dispatch(
          login({
            email: user.user?.email,
            uid: user.user?.uid,
          })
        );
        router.push('/home');
        toast.success('Success Login');
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      <Head>
        <title>Game Land | Sign In </title>
      </Head>
      <section className='login spad auth'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-6'>
              <div className='login__form'>
                <h3>Login</h3>
                <form onSubmit={handleSubmit}>
                  <div className='input__item'>
                    <input
                      type='text'
                      placeholder='Email address'
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <span>
                      <i className='fas fa-envelope'></i>
                    </span>
                  </div>
                  <div className='input__item'>
                    <input
                      type='password'
                      placeholder='Password'
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span>
                      <i className='fas fa-lock'></i>
                    </span>
                  </div>
                  <button type='submit' className='btn btn-danger'>
                    Sign In Now
                  </button>
                </form>
                <a href='#' className='forget_pass'>
                  Forgot Your Password?
                </a>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='login__register'>
                <h3>Dont’t Have An Account?</h3>
                <Link href={'/auth/signup'}>
                  <a className='primary-btn'>Sign Up Now</a>
                </Link>
              </div>
            </div>
          </div>
          <div className='login__social'>
            <div className='row d-flex justify-content-center'>
              <div className='col-lg-6'>
                <div className='login__social__links'>
                  <span>or</span>
                  <ul>
                    <li>
                      <a className='google'>
                        <i className='fab fa-google' /> Sign in With Google
                      </a>
                    </li>
                    <li>
                      <a className='facebook'>
                        <i className='fab fa-facebook' /> Sign in With Facebook
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SigninWrapper;
