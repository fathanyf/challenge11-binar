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

const AdminVideosWrapper = () => {
  return (
    <Provider store={store}>
      <h1>Upload and Stream Walkthrough and Experince Video</h1>
      <Videos />
    </Provider>
  );
};

const Videos = () => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [videoUpload, setVideoUpload] = useState('');
  const [post, setPost] = useState('');
  const [video, setvideo] = useState([]);

  const user = useSelector(selectUser);
  const id = user?.uid;

  const router = useRouter();

  const profileData = useSelector((state) => state.profile.currentProfile);
  const dispatch = useDispatch();

  const getVideos = () => {
    const dbRef = collection(db, 'videos2cTest');
    getDocs(dbRef)
      .then((snapshot) => {
        let result = [];
        snapshot.docs.forEach((doc) => {
          result.push({ ...doc.data(), id: doc.id });
        });
        setvideo(result);
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
    getVideos();
  }, [dispatch, profileData.name, profileData.avatar]);

  const videoSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('file', videoUpload);
    formdata.append('upload_preset', 'lznoc89x');
    const videoDB = collection(db, 'videos2cTest');

    const data = await axios
      .post(
        'https://api.cloudinary.com/v1_1/binar-cloud/video/upload',
        formdata
      )
      .then((res) => {
        setPost('');
        setVideoUpload('');
        addDoc(videoDB, {
          name,
          avatar,
          post,
          url: res.data.secure_url,
          createdAt: serverTimestamp(),
        });
        router.push('/home');
        toast.success('Video Upload Success !');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='container'>
      <div className='row mt-5'>
        <div className='col-4'>
          <div className='card'>
            <div className='card-body'>
              <form onSubmit={videoSubmit}>
                <div className='input-group input-group-dynamic mb-4'>
                  <input
                    type='text'
                    className='form-control'
                    name='post'
                    placeholder='video title...'
                    onChange={(e) => setPost(e.target.value)}
                  />
                </div>
                <div className='input-group input-group-dynamic'>
                  <input
                    type='file'
                    className='form-control'
                    onChange={(e) => {
                      setVideoUpload(e.target.files[0]);
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
      

      {/* <div className='row mt-2'>
        {video &&
          video.map((e) => {
            if (!video || !profileData) {
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
                    <video className='img-fluid pad' src={e.url} controls />
                    <p>{e.post}</p>
                    <i className='fas fa-share' /> <small>Share</small>
                    <i className='far fa-thumbs-up ml-3' /> <small>Like</small>
                    <span className='float-right text-muted'>
                      <small>0 likes - 0 comments</small>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div> */}
    </div>
  );
};

export default AdminVideosWrapper;