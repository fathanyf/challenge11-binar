import React, { useEffect, useState } from 'react';
import { selectUser } from '../../store/users/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  get_profile_data,
  update_profile_data,
} from '../../store/profile/ProfileSlice';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const UpdatePage = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  const auth = useSelector((state) => state.user);
  const user = useSelector(selectUser);
  const id = user?.uid;

  const router = useRouter();

  // FIRESTORE STORAGE

  const handleImageFile = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  // console.log("image--: ", avatar);

  const handleImageSubmit = () => {
    const storageRef = ref(storage, user.uid + avatar.name);

    const uploadTask = uploadBytesResumable(storageRef, avatar);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setAvatar(downloadURL.toString());
          toast.success('Image uploaded!');
        });
      }
    );
  };

  const profileData = useSelector((state) => state.profile.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(get_profile_data(id));
      setName(auth.data.name);
      setAddress(auth.data.address);
      setPhone(auth.data.phone);
      setAvatar(auth.data.avatar);
    }
  }, [
    dispatch,
    auth.data.name,
    auth.data.address,
    auth.data.phone,
    auth.data.avatar,
    id,
  ]);

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      const profileCollectionRef = doc(db, 'gamepoint', id);
      if (avatar == null) return;
      const imageRef = ref(storage, `images/${avatar.name}`);
      uploadBytes(imageRef, avatar).then((snapshot) => {
        let avatar = '';
        getDownloadURL(snapshot.ref).then((url) => {
          avatar = url;
          dispatch(update_profile_data({ id, name, address, phone, avatar }));
          updateDoc(profileCollectionRef, { name: name, avatar: avatar });
        });
      });
      console.log(avatar);
      router.push('/home');
      toast.success('Update Successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <section className='dark-mode'>
        <div className='container'>
          <div className='row mt-5'>
            <div className='col-6 offset-3'>
              <div className='card card-danger'>
                <div className='card-header'>
                  <h3 className='card-title'>Form Update Profile</h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className='card-body'>
                    <div className='form-group'>
                      <label htmlFor='exampleInputEmail1'>Name</label>
                      <input
                        type='text'
                        className='form-control'
                        name='address'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className='form-group'>
                      <label htmlFor='exampleInputEmail1'>Address</label>
                      <input
                        type='text'
                        className='form-control'
                        name='address'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className='form-group'>
                      <label htmlFor='exampleInputPassword1'>Phone</label>
                      <input
                        type='text'
                        className='form-control'
                        name='phone'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className='form-group'>
                      <label htmlFor='exampleInputPassword1'>Avatar</label>
                      <input
                        type='file'
                        onChange={handleImageFile}
                        className='form-control'
                      />
                    </div>
                  </div>
                  <div className='card-footer'>
                    <button
                      onClick={handleImageSubmit}
                      type='submit'
                      className='btn btn-danger btn-block'
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdatePage;
