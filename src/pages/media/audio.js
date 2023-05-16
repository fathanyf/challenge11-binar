import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { db, storage } from '../../config/firebase';
import { get_current_profile } from '../../store/profile/ProfileSlice';
import { selectUser } from '../../store/users/UserSlice';
import { toast } from 'react-toastify';
import moment from 'moment';
import { store } from '../../store';
import Head from 'next/head';

const AudioWrapper = () => {
  return (
    <Provider store={store}>
      <Audio />
    </Provider>
  );
};

const Audio = () => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [audioUpload, setAudioUpload] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audio, setAudio] = useState([]);

  const user = useSelector(selectUser);
  const id = user?.uid;

  const router = useRouter();

  const profileData = useSelector((state) => state.profile.currentProfile);
  const dispatch = useDispatch();

  const getAudio = () => {
    const dbRef = collection(db, 'musics');
    getDocs(dbRef)
      .then((snapshot) => {
        let result = [];
        snapshot.docs.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });
        setAudio(result);
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAudio();
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(get_current_profile(id));
      setName(profileData.name);
      setAvatar(profileData.avatar);
    }
  }, [dispatch, profileData.name, profileData.avatar]);

  // if (!profileData) {
  //   return (
  //     <div className='d-flex justify-content-center mt-3'>
  //       <div className='spinner-border text-danger' role='status'>
  //         <span className='sr-only'>Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  const AudioSubmit = (e) => {
    e.preventDefault();
    if (audioUpload == null) return;
    const mediaDB = collection(db, 'musics');
    const mediaRef = ref(storage, `musics/${audioUpload.name}`);
    uploadBytes(mediaRef, audioUpload).then((snapshot) => {
      let inputMedia = '';
      getDownloadURL(snapshot.ref).then((url) => {
        inputMedia = url;
        addDoc(mediaDB, {
          name,
          avatar,
          title,
          artist,
          link: inputMedia,
          createdAt: serverTimestamp(),
        });
      });
    });
    router.push('/home');
    toast.success('File Upload Success !');
  };

  // if (!audio) {
  //   return (
  //     <div className='d-flex justify-content-center mt-3'>
  //       <div className='spinner-border text-danger' role='status'>
  //         <span className='sr-only'>Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <Head>
        <title>Game land | Audio </title>
      </Head>
      <div className='container'>
        <div className='row mt-5'>
          <div className='col-4'>
            <div className='card'>
              <div className='card-body'>
                <form onSubmit={AudioSubmit}>
                  <div className='input-group input-group-dynamic mb-4'>
                    <input
                      type='text'
                      className='form-control'
                      name='title'
                      placeholder='song title...'
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className='input-group input-group-dynamic mb-4'>
                    <input
                      type='text'
                      className='form-control'
                      name='artist'
                      placeholder='Artist...'
                      onChange={(e) => setArtist(e.target.value)}
                    />
                  </div>
                  <div className='input-group input-group-dynamic'>
                    <input
                      type='file'
                      className='form-control'
                      onChange={(e) => {
                        setAudioUpload(e.target.files[0]);
                      }}
                    />
                  </div>
                  <button
                    type='submit'
                    className='btn btn-primary btn-block mt-4'
                  >
                    Upload
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className='row mt-2'>
          {audio.map((e) => {
            if (!audio && !profileData) {
              return (
                <div className='d-flex justify-content-center mt-3'>
                  <div className='spinner-border text-danger' role='status'>
                    <span className='sr-only'>Loading...</span>
                  </div>
                </div>
              );
            }
            return (
              <div className='col-lg-4 col-sm-6' key={e.id}>
                <div className='card'>
                  <div className='card-header'>
                    <div className='user-block'>
                      <img
                        className='img-circle'
                        src={e.avatar}
                        alt='User Image'
                      />
                      <span className='ml-2'>Publish by : {e.name}</span>
                    </div>
                  </div>
                  <div className='card-body'>
                    <div className='card mb-2 bg-gradient-dark text-black'>
                      <img
                        className='card-img-top'
                        src='https://images.unsplash.com/photo-1609667083964-f3dbecb7e7a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzB8fG5vdGF0aW9uJTIwbXVzaWN8ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60'
                        alt='Dist Photo 1'
                      />
                      <div className='card-img-overlay d-flex flex-column justify-content-end'>
                        <h5 className='card-title text-primary text-white'>
                          Artist : {e.artist}
                        </h5>
                        <p className='card-text text-white pb-2 pt-1'>
                          Song Title : {e.title}
                        </p>
                        <p className='card-text text-white pb-2 pt-1'>
                          <small>
                            Upload : {moment(e?.createdAt.toDate()).fromNow()}
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>
                  <audio controls>
                    <source src={e.link} type='audio/mpeg' />
                  </audio>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AudioWrapper;
