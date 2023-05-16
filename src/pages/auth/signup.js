import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { auth, db, storage } from '../../config/firebase';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (avatar == null) return;
      const imageRef = ref(storage, `images/${avatar.name}`);
      uploadBytes(imageRef, avatar).then((snapshot) => {
        let inputImage = '';
        getDownloadURL(snapshot.ref).then((url) => {
          inputImage = url;
          setDoc(doc(db, 'users', user.uid), {
            name,
            address: '',
            phone: '',
            avatar: inputImage,
            bio: '',
            playerId: user.uid,
            createdAt: serverTimestamp(),
          });
          setDoc(doc(db, 'gamepoint', user.uid), {
            totalpoint: 0,
            name,
            avatar: inputImage,
            playerId: user.uid,
            updatetAt: serverTimestamp(),
          });
        });
      });
      router.push('/auth/signin');
      toast.success('Sign Up successfully , please Sign in now !');
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <>
      <Head>
        <title>Game Land | Sign Up </title>
      </Head>
      <section className='signup spad auth'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-6'>
              <div className='login__form'>
                <h3>Sign Up</h3>
                <form onSubmit={handleSubmit}>
                  <div className='input__item'>
                    <input
                      type='text'
                      placeholder='Your Name'
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <span>
                      <i className='fas fa-user'></i>
                    </span>
                  </div>
                  <div className='input__item'>
                    <input
                      type='email'
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
                  <div className='input__item'>
                    <input
                      type='file'
                      onChange={(e) => {
                        setAvatar(e.target.files[0]);
                      }}
                      required
                    />
                    <span>
                      <i className='fas fa-image'></i>
                    </span>
                  </div>
                  <button type='submit' className='btn btn-danger'>
                    Sign Up Now
                  </button>
                </form>
                <h5>
                  Already have an account?{' '}
                  <Link href={'/auth/signin'}>
                    <a>Sign In!</a>
                  </Link>
                </h5>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='login__social__links'>
                <h3>Login With:</h3>
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
      </section>
    </>
  );
};

export default Signup;
