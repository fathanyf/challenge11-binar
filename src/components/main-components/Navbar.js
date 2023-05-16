import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../store/users/UserSlice';
import { auth } from '../../config/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Modal from 'react-modal';
import { useState } from 'react';
import UpdatePage from '../../pages/account/profile';

const Navbar = () => {
  const user = useSelector(selectUser);

  const router = useRouter();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    auth.signOut();
    toast.warning('You are now logout');
    router.push('/auth/signin');
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <>
      <header className='header'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-2'>
              <div className='header__logo'>
                <Link href={'/home'}>
                  <a>
                    <img src='/logoch11.png' style={{ height: '30px' }} />
                  </a>
                </Link>
              </div>
            </div>
            <div className='col-lg-10'>
              <div className='header__nav'>
                <nav className='header__menu mobile-menu'>
                  <ul>
                    <li className=''>
                      <Link href={'/home'}>
                        <a>Homepage</a>
                      </Link>
                    </li>
                    <li>
                      <Link href={'/games'}>
                        <a>Playground</a>
                      </Link>
                    </li>
                    <li>
                      <Link href={'/home'}>
                        <a>
                          Media <span className='arrow_carrot-down' />
                        </a>
                      </Link>
                      <ul className='dropdown'>
                        <li>
                          <Link href={'/media/upload'}>
                            <a>Upload Files</a>
                          </Link>
                        </li>
                        <li>
                          <Link href={'/media/files'}>
                            <a>File List</a>
                          </Link>
                        </li>
                        <li>
                          <Link href={'/media/video'}>
                            <a>Video</a>
                          </Link>
                        </li>
                        <li>
                          <Link href={'/media/videoAdmin'}>
                            <a>Upload Video Walkthrough</a>
                          </Link>
                        </li>
                        <li>
                          <Link href={'/media/audio'}>
                            <a>Audio</a>
                          </Link>
                        </li>
                        <li>
                          <Link href={'/media/images'}>
                            <a>Image</a>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <Link
                      href={{ pathname: '/account', query: { id: user?.uid } }}
                    >
                      <a style={{ marginLeft: '250px', color: 'white' }}>
                        <b>{user?.email}</b>
                      </a>
                    </Link>
                    <li>
                      <Link href={'/home'}>
                        <a>
                          Manage User <span className='arrow_carrot-down' />
                        </a>
                      </Link>
                      <ul className='dropdown'>
                        <li>
                          <a className='btn' onClick={handleLogout}>
                            Logout
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
