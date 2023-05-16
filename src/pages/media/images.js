import axios from 'axios';
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

const ImagesWrapper = () => {
  return (
    <Provider store={store}>
      <Images />
    </Provider>
  );
};

const Images = () => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [imageUpload, setImageUpload] = useState('');
  const [post, setPost] = useState('');
  const [image, setImage] = useState([]);

  const user = useSelector(selectUser);
  const id = user?.uid;

  const router = useRouter();

  const profileData = useSelector((state) => state.profile.currentProfile);
  const dispatch = useDispatch();

  const getImages = () => {
    const dbRef = collection(db, 'images');
    getDocs(dbRef)
      .then((snapshot) => {
        let result = [];
        snapshot.docs.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });
        setImage(result);
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (id) {
      dispatch(get_current_profile(id));
      setName(profileData.name);
      setAvatar(profileData.avatar);
    }
    getImages();
  }, [dispatch, profileData.name, profileData.avatar]);

  const imageSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('file', imageUpload);
    formdata.append('upload_preset', 'lznoc89x');
    const imageDB = collection(db, 'images');

    const data = await axios
      .post(
        'https://api.cloudinary.com/v1_1/binar-cloud/image/upload',
        formdata
      )
      .then((res) => {
        setPost('');
        setImageUpload('');
        addDoc(imageDB, {
          name,
          avatar,
          post,
          url: res.data.secure_url,
          createdAt: serverTimestamp(),
        });
        router.push('/home');
        toast.success('Image Upload Success !');
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>Game land | Image </title>
      </Head>
      <div className='container'>
        <div className='row mt-5'>
          <div className='col-4'>
            <div className='card'>
              <div className='card-body'>
                <form onSubmit={imageSubmit}>
                  <div className='input-group input-group-dynamic mb-4'>
                    <input
                      type='text'
                      className='form-control'
                      name='post'
                      placeholder='post a comment...'
                      onChange={(e) => setPost(e.target.value)}
                    />
                  </div>
                  <div className='input-group input-group-dynamic'>
                    <input
                      type='file'
                      className='form-control'
                      onChange={(e) => {
                        setImageUpload(e.target.files[0]);
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
          {image &&
            image.map((e) => {
              if (!image || !profileData) {
                return (
                  <div className='d-flex justify-content-center mt-3'>
                    <div className='spinner-border text-danger' role='status'>
                      <span className='sr-only'>Loading...</span>
                    </div>
                  </div>
                );
              }
              return (
                <div className='col-md-4' key={e.id}>
                  <div className='card card-widget mt-2'>
                    <div className='card-header'>
                      <div className='user-block'>
                        <img
                          className='img-circle'
                          src={e.avatar}
                          alt='User Image'
                        />
                        <span className='ml-2'>{e.name}</span>
                        <span className='description'>
                          Publish - {moment(e?.createdAt.toDate()).fromNow()}
                        </span>
                      </div>
                    </div>
                    <div className='card-body'>
                      <img className='img-fluid pad' src={e.url} alt='Photo' />
                      <p>{e.post}</p>
                      <i className='fas fa-share' /> <small>Share</small>
                      <i className='far fa-thumbs-up ml-3' />{' '}
                      <small>Like</small>
                      <span className='float-right text-muted'>
                        <small>0 likes - 0 comments</small>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ImagesWrapper;
