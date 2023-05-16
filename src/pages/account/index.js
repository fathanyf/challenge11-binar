import Head from 'next/head';
import GameBoard from '../../components/game-components/GameBoard';
import LeaderBoard from '../../components/player-components/LeaderBoard';
import PlayerList from '../../components/player-components/PlayerList';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  fetchOtherUserGamePoint,
  fetchUserGame,
  fetchUserGamePoint,
  selectUser,
} from '../../store/users/UserSlice';
import { get_profile_data } from '../../store/profile/ProfileSlice';
import Image from 'next/image';
import Modal from 'react-modal';
import {
  Page,
  Text,
  View,
  // Image,
  Document,
  StyleSheet,
  BlobProvider,
} from '@react-pdf/renderer';
import UpdatePage from './profile';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    border: '15px solid #f00',
  },
  title: {
    fontSize: '60px',
    fontWeight: 'bold',
    color: 'black',
    marginTop: '20px',
  },
  section: {
    margin: 6,
    padding: 10,
    fontSize: '30pt',
    textAlign: 'center',
  },
  name: {
    fontSize: '80px',
    color: 'red',
    marginTop: '60px',
  },
  image: {
    width: '30%',
    padding: 10,
  },
  grade: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: 'red',
    marginTop: '40px',
  },
  point: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: 'red',
    marginTop: '20px',
  },
});

const Account = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const leaderBoard = useSelector((state) => state.player.leaderBoard);
  const playerData = useSelector((state) => state.profile.profile);
  const data = useSelector((state) => state.games.gamesBoard);
  const [imageSrc, setImageSrc] = useState('');

  const user = useSelector(selectUser);
  const auth = useSelector((state) => state.user);

  const handleOnError = () => {
    setImageSrc(auth.data2.avatar);
  };

  const handleOnErrorOtherPlayer = () => {
    setImageSrc(playerData.avatar);
  };

  let { id } = router.query;

  useEffect(() => {
    if (auth.user?.uid) {
      dispatch(fetchUserGamePoint(auth.user?.uid));
      dispatch(fetchUserGame(auth.user?.uid));
      // dispatch(fetchUserById(user.uid))
      // dispatch(fetchUserGame())
    }
  }, [auth.user?.uid, dispatch]);

  useEffect(() => {
    if (playerData?.id) {
      dispatch(fetchOtherUserGamePoint(playerData?.id));
    }
  }, [dispatch, id, playerData?.id]);

  useEffect(() => {
    if (id) {
      dispatch(get_profile_data(id));
    }
  }, [dispatch, id, user]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);

  // PDF Wrapper
  const pdfText = () => {
    return (
      <Document>
        <Page size='A4' orientation='landscape' style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.name}>{playerData.name}</Text>
            <View style={styles.section}>
              <Text>Alamat : {playerData.address}</Text>
              <Text>Phone : {playerData.phone}</Text>
              <Text style={styles.grade}>
                Grade : {''}
                <span className='float-right badge bg-warning'>{rank}</span>
              </Text>
              <Text style={styles.point}>Point : {auth.data2.totalpoint}</Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  const rank = useMemo(() => {
    if (auth.data2.totalpoint > 10 && auth.data2.totalpoint <= 49) {
      return 'Intermediate';
    }

    if (auth.data2.totalpoint >= 50) {
      return 'Pro Player';
    }

    return 'Newbie';
  }, [auth.data2.totalpoint]);

  return (
    <>
      <Head>
        <title>Game land | Account </title>
      </Head>
      <section className='dark-mode'>
        <div className='container'>
          <div className='row mt-3'>
            <div className='col-md-3'>
              <div className='card card-danger card-outline'>
                <div className='card-body box-profile'>
                  {id === auth.user?.uid ? (
                    <>
                      <div className='text-center'>
                        {/* eslint-disable-next-line */}
                        <img
                          className='profile-user-img img-fluid img-circle'
                          src={auth.data2.avatar}
                          alt='User profile picture'
                        />
                      </div>
                      <h3 className='profile-username text-center'>
                        {auth.data.name}
                      </h3>
                      <ul className='list-group list-group-unbordered mb-3'>
                        <li className='list-group-item'>
                          <b>Address</b>{' '}
                          <a className='float-right'>{auth.data.address}</a>
                        </li>
                        <li className='list-group-item'>
                          <b>Phone</b>{' '}
                          <a className='float-right'>{auth.data.phone}</a>
                        </li>
                      </ul>

                      {/* Update Profile */}
                      <button
                        className='btn btn-danger btn-block'
                        onClick={() => setModalIsOpen2(true)}
                      >
                        Update Profile
                      </button>
                      <Modal
                        isOpen={modalIsOpen2}
                        ariaHideApp={false}
                        onRequestClose={() => setModalIsOpen2(false)}
                        style={{
                          overlay: {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                          },
                          content: {
                            position: 'absolute',
                            top: '90px',
                            left: '285px',
                            right: '285px',
                            bottom: '90px',
                            border: '1px solid #ccc',
                            background: '#343a40',
                            overflow: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            borderRadius: '4px',
                            outline: 'none',
                            padding: '20px',
                            color: '#fff',
                          },
                        }}
                      >
                        <div style={{ height: '100%' }}>
                          <UpdatePage />
                        </div>
                      </Modal>

                      {/* Generate Profile */}
                      <button
                        className='btn btn-danger btn-block'
                        onClick={() => setModalIsOpen(true)}
                      >
                        Certificate
                      </button>
                      <Modal
                        isOpen={modalIsOpen}
                        ariaHideApp={false}
                        onRequestClose={() => setModalIsOpen(false)}
                        style={{
                          overlay: {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                          },
                          content: {
                            position: 'absolute',
                            top: '40px',
                            left: '40px',
                            right: '40px',
                            bottom: '40px',
                            border: '1px solid #ccc',
                            background: '#343a40',
                            overflow: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            borderRadius: '4px',
                            outline: 'none',
                            padding: '20px',
                            color: '#fff',
                          },
                        }}
                      >
                        <div style={{ height: '100%' }}>
                          <button onClick={() => setModalIsOpen(false)}>
                            Close
                          </button>
                          <BlobProvider document={pdfText()}>
                            {({ url }) => (
                              <iframe
                                src={url}
                                style={{ width: '100%', height: '100%' }}
                              />
                            )}
                          </BlobProvider>
                        </div>
                      </Modal>
                    </>
                  ) : (
                    <>
                      <div className='text-center'>
                        {/* eslint-disable-next-line */}
                        <img
                          className='profile-user-img img-fluid img-circle'
                          src={playerData.avatar}
                          alt='User profile picture'
                        />
                      </div>
                      <h3 className='profile-username text-center'>
                        {playerData.name}
                      </h3>
                      <ul className='list-group list-group-unbordered mb-3'>
                        <li className='list-group-item'>
                          <b>Address</b>{' '}
                          <a className='float-right'>{playerData.address}</a>
                        </li>
                        <li className='list-group-item'>
                          <b>Phone</b>{' '}
                          <a className='float-right'>{playerData.phone}</a>
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              </div>
              <div className='card card-widget widget-user-2 shadow-sm'>
                <div className='widget-user bg-danger'>
                  <h5 className='p-2 text-center'>Game History</h5>
                </div>
                <div className='card-footer p-0'>
                  {id === auth.user?.uid ? (
                    <ul className='nav flex-column'>
                      <li className='nav-item'>
                        <a href='#' className='nav-link'>
                          RPS Points{' '}
                          <span className='float-right badge bg-warning'>
                            {auth.data2.totalpoint}
                          </span>
                        </a>
                      </li>
                      <li className='nav-item'>
                        <a href='#' className='nav-link'>
                          Grade
                          <span className='float-right badge bg-warning'>
                            {rank}
                          </span>
                        </a>
                      </li>
                    </ul>
                  ) : (
                    <ul className='nav flex-column'>
                      <li className='nav-item'>
                        <a href='#' className='nav-link'>
                          RPS Points{' '}
                          <span className='float-right badge bg-warning'>
                            {auth.data2.totalpoint}
                          </span>
                        </a>
                      </li>
                      <li className='nav-item'>
                        <a href='#' className='nav-link'>
                          Grade{' '}
                          <span className='float-right badge bg-warning'>
                            {rank}
                          </span>
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
                <div className='card-footer p-0'>
                  <ul className='nav flex-column'></ul>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='card'>
                <div className='card-header p-2 bg-danger'>
                  <h2 className='text-center text-light'>Game Board</h2>
                </div>
                <div className='card-body'>
                  <GameBoard />
                </div>
              </div>
            </div>
            <div className='col-md-3'>
              <div className='card card-danger'>
                <div className='card-header text-center'>
                  <h3 className='card-title'>Player List</h3>
                </div>
                <PlayerList />
              </div>
              <div className='card card-danger'>
                <div className='card-header'>
                  <h3 className='card-title'>Leader Board</h3>
                </div>
                <LeaderBoard />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Account;
