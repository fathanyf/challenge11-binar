// import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, queryEqual, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { RPSChoice } from '../../../data';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
// import { get_games, get_total_score, get_user, save_and_update_gamestats } from '../../actions/GamesAction'
import {
  totalDraw,
  totalLoss,
  totalScore,
  totalWin,
} from '../../store/point/PointSlicer';
import { fetchUserGamePoint } from '../../store/users/UserSlice';
import { serverTimestamp } from 'firebase/firestore';
import { quitAndSave, getGameList } from '../../store/games/GamesSlice';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Head from 'next/head';

const Title = styled.h1`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 3.5em;
  text-align: center;
  margin-bottom: 0.5em;
`;
const GameRecord = styled.h2`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.5em;
  text-align: center;
  border-bottom: 2px solid gray;
  margin-bottom: 0.5em;
`;

const ImageChoice = styled.img`
  width: 60px;
  height: 100px;
  align-items: center;
  margin-top: 2em;
`;

const PlayerChoice = styled.div`
  display: flex;
  justify-content: center;
  height: 400px;
  align-items: center;
  margin: 0 auto;
`;

const PlayerChoiceImage = styled.img`
  width: 60px;
  height: 60px;
  margin-top: 1em;
  border: none;
`;

const ComputerChoiceImage = styled.img`
  width: 60px;
  height: 60px;
  margin-top: 1em;
  border: none;
`;

const GameResult = styled.h1`
  font-size: 48px;
`;

const InnerText = styled.p`
  color: whitesmoke;
  font-size: 2em;
  opacity: 0;
  transition: all 0.5s ease;
`;

const Button = styled.button`
  width: 150px;
  height: 180px;
  border: 5px solid whitesmoke;
  border-radius: 50px;
  margin-top: 20px;
  margin-right: 20px;
  background-color: #323233;
  transition: all 0.5s ease;

  &:hover {
    background-color: #325544;
    transform: translateY(-40px);
    height: 200px;
    width: 180px;
  }

  &:hover ${InnerText} {
    opacity: 1;
    transform: translateY(-10px);
  }
`;

const Guide = styled.ul``;

const GuideList = styled.li`
  text-align: center;
  font-weight: 500;
  list-style: none;
  margin-top: 3px;
  color: gray;
`;

const GuideDesc = styled.div`
  background-color: white;
  width: fit-content;
  margin: 10px auto 0px;
`;

const waiting = async (t) => new Promise((r) => setTimeout(r, t));

const RPS = () => {
  // const { user } = UserAuth()

  const router = useRouter();

  const options = ['rock', 'paper', 'scissors'];
  const [counter, setCounter] = useState(0);
  const [btn, setBtn] = useState(true);
  const [guide, setGuide] = useState(false);
  const [loading, setLoading] = useState('Quit and Save');
  const [choices, setChoices] = useState({
    player: null,
    computerChoice: null,
    statusMatch: null,
  });

  const point = useSelector((state) => state.pointReducer);
  const userGame = useSelector((state) => state.gameReducer);
  const dispatch = useDispatch();

  const [currentPointTotal, setCurrentPointTotal] = useState(0);
  const [totalScores, setTotalScores] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleChoices = (e) => {
    e.preventDefault();

    const computerChoice = options[Math.floor(Math.random() * options.length)];
    const player = e.currentTarget.dataset.name;

    let statusMatch = null;
    let codeName = player + computerChoice;
    let scoreState = point.score;

    switch (codeName) {
      case 'scissorspaper':
      case 'rockscissors':
      case 'paperrock':
        statusMatch = 'You Win';
        scoreState += 10;

        dispatch(totalWin());
        break;
      case 'paperscissors':
      case 'scissorsrock':
      case 'rockpaper':
        statusMatch = 'You Lose';
        scoreState -= 5;

        dispatch(totalLoss());
        break;
      case 'rockrock':
      case 'paperpaper':
      case 'scissorsscissors':
        statusMatch = 'Its a Draw';

        dispatch(totalDraw());
        break;
    }

    dispatch(totalScore(scoreState));
    setChoices({ player, computerChoice, statusMatch });
    setCounter(counter + 1);
    stopGame();
  };

  const stopGame = () => {
    if (counter === 4) {
      setBtn(false);
    }
  };

  const auth = useSelector((state) => state.user);
  useEffect(() => {
    if (auth.user?.uid) {
      dispatch(fetchUserGamePoint(auth.user?.uid));
      // dispatch(fetchUserGame(auth.user?.uid))
      // dispatch(fetchUserById(user.uid))
      // dispatch(fetchUserGame())
    }
  }, [auth.user?.uid, dispatch]);

  const handleSaveGame = async () => {
    const href = location.href.split('/');
    const qstring = href[href.length - 1];

    const { avatar, name, playerId } = auth.data2;

    const data = {
      playerId,
      point: point.score,
      playCount: counter,
      userWin: point.win,
      userLoss: point.loss,
      userDraw: point.draw,
      name,
      qstring,
      avatar,
      router,
      createdAt: serverTimestamp(),
    };

    setLoading('Processing...');
    await waiting(3000);

    try {
      dispatch(quitAndSave(data));
      dispatch(getGameList(playerId));
      toast.success('Saved Game!');
      setLoading('Redirecting');
      await waiting(1000);
      router.push('/games');
    } catch (err) {
      console.log(err);
    }
  };

  const gameRecord = useSelector((state) => state.totalWin);

  return (
    <>
      <Head>
        <title>Game land | Rock Paper Scissors </title>
      </Head>
      <section className='dark-mode'>
        <div className='container'>
          <h1 className='text-center text-uppercase text-light mt-3'>
            Rock Paper Scissors
          </h1>
          <div className='callout callout-danger my-1'>
            <p className='text-light'>
              All players at least play the game five times ,for the winner will
              get 5 point, if loses points will get 0 point,and if get draw
              condition you will 1 point. For badges players who score 0 points
              will get a brown badge, 0-25 points will get a silver badge and
              above 25 points players will get a gold badge
            </p>
          </div>
          <div className='row'>
            <div className='col-md-3 col-sm-6 col-12'>
              <div className='info-box'>
                <span className='info-box-icon bg-info'>
                  <i className='fas fa-thumbs-up' />
                </span>
                <div className='info-box-content'>
                  <span className='info-box-text'>Win</span>
                  <span className='info-box-number'>{point.win}</span>
                </div>
                {/* /.info-box-content */}
              </div>
              {/* /.info-box */}
            </div>
            {/* /.col */}
            <div className='col-md-3 col-sm-6 col-12'>
              <div className='info-box'>
                <span className='info-box-icon bg-success'>
                  <i className='fas fa-handshake' />
                </span>
                <div className='info-box-content'>
                  <span className='info-box-text'>Draw</span>
                  <span className='info-box-number'>{point.draw}</span>
                </div>
                {/* /.info-box-content */}
              </div>
              {/* /.info-box */}
            </div>
            {/* /.col */}
            <div className='col-md-3 col-sm-6 col-12'>
              <div className='info-box'>
                <span className='info-box-icon bg-warning'>
                  <i className='fas fa-thumbs-down' />
                </span>
                <div className='info-box-content'>
                  <span className='info-box-text'>Loss</span>
                  <span className='info-box-number'>{point.loss}</span>
                </div>
                {/* /.info-box-content */}
              </div>
              {/* /.info-box */}
            </div>
            {/* /.col */}
            <div className='col-md-3 col-sm-6 col-12'>
              <div className='info-box'>
                <span className='info-box-icon bg-danger'>
                  <i className='fas fa-chalkboard-teacher'></i>
                </span>
                <div className='info-box-content'>
                  <span className='info-box-text'>Score</span>
                  <span className='info-box-number'>{point.score}</span>
                </div>
                {/* /.info-box-content */}
              </div>
              {/* /.info-box */}
            </div>
            {/* /.col */}
            <div className='col-md-4 col-sm-6 col-12 mt-3'>
              <div className='info-box'>
                <span className='img-rounded'>
                  <ImageChoice
                    src={auth.data2?.avatar}
                    style={{ width: '60px' }}
                  />
                </span>
                <div className='info-box-content'>
                  <span className='info-box-number'>
                    Username :&nbsp; {auth.data2?.name}
                  </span>
                  <span className='info-box-number'>
                    Current Score: {auth.data2?.totalpoint}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='row my-3'>
            <div className='col-md-4'>
              <h3 className='text-uppercase text-center'>
                Player <span className='text-danger'>choice</span> ({counter})
              </h3>
              <div className='mt-4 text-center'>
                {choices.player === 'rock' && (
                  <ImageChoice
                    src='/rock.svg'
                    alt=''
                    style={{ width: '150px' }}
                  />
                )}
                {choices.player === 'paper' && (
                  <ImageChoice
                    src='/paper.svg'
                    alt=''
                    style={{ width: '150px' }}
                  />
                )}
                {choices.player === 'scissors' && (
                  <ImageChoice
                    src='/scissors.svg'
                    alt=''
                    style={{ width: '150px' }}
                  />
                )}
              </div>
            </div>
            <div className='col-md-4 d-flex justify-content-center align-items-center'>
              {choices.statusMatch === 'YOU WIN!' && (
                <i
                  className='fas fa-thumbs-up fa-6x'
                  style={{ color: '#00C851' }}
                ></i>
              )}
              {choices.statusMatch === 'ITS A DRAW!' && (
                <i
                  className='fas fa-handshake fa-6x'
                  style={{ color: '#33b5e5' }}
                ></i>
              )}
              {choices.statusMatch === 'YOU LOSE!' && (
                <i
                  className='fas fa-thumbs-down fa-6x'
                  style={{ color: '#ff4444' }}
                ></i>
              )}
            </div>
            <div className='col-md-4'>
              <h3 className='text-uppercase text-center'>
                computer <span className='text-danger'>choice</span>
              </h3>
              <div className='mt-4 text-center'>
                {choices.computerChoice === 'rock' && (
                  <ImageChoice
                    src='/rock.svg'
                    alt=''
                    style={{ width: '150px' }}
                  />
                )}
                {choices.computerChoice === 'paper' && (
                  <ImageChoice
                    src='/paper.svg'
                    alt=''
                    style={{ width: '150px' }}
                  />
                )}
                {choices.computerChoice === 'scissors' && (
                  <ImageChoice
                    src='/scissors.svg'
                    alt=''
                    style={{ width: '150px' }}
                  />
                )}
              </div>
            </div>
            <PlayerChoice>
              {RPSChoice.map((item) => (
                <Button
                  key={item.id}
                  onClick={handleChoices}
                  data-name={item.choice}
                >
                  <ImageChoice src={item.img} />
                  <InnerText>{item.choice}</InnerText>
                </Button>
              ))}
            </PlayerChoice>
          </div>
          <div className='row d-flex justify-content-center'>
            <button
              className='btn btn-danger btn-flat'
              type='submit'
              onClick={handleSaveGame}
            >
              {loading}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default RPS;
