import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGameList, saveMemory } from '../../store/games/GamesSlice';
import { fetchUserGamePoint } from '../../store/users/UserSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Head from 'next/head';
const board = ['🤖', '👽', '🎃', '🤡', '👶', '😸', '😄', '😈'];

export default function Memory() {
  const [boardData, setBoardData] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (matchedCards.length == 16) {
      setGameOver(true);
    }
  }, [moves]);

  const dispatch = useDispatch();
  const router = useRouter();

  const point = useSelector((state) => state.pointReducer);

  const auth = useSelector((state) => state.user);

  const [loading, setLoading] = useState('Quit');

  useEffect(() => {
    if (auth.user?.uid) {
      dispatch(fetchUserGamePoint(auth.user?.uid));
    }
  }, [auth.user?.uid, dispatch]);

  const initialize = () => {
    shuffle();
    setGameOver(false);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
  };
  const shuffle = () => {
    const shuffledCards = [...board, ...board]
      .sort(() => Math.random() - 0.5)
      .map((v) => v);

    setBoardData(shuffledCards);
  };

  const updateActiveCards = (i) => {
    if (!flippedCards.includes(i)) {
      if (flippedCards.length == 1) {
        const firstIdx = flippedCards[0];
        const secondIdx = i;
        if (boardData[firstIdx] == boardData[secondIdx]) {
          setMatchedCards((prev) => [...prev, firstIdx, secondIdx]);
        }

        setFlippedCards([...flippedCards, i]);
      } else if (flippedCards.length == 2) {
        setFlippedCards([i]);
      } else {
        setFlippedCards([...flippedCards, i]);
      }

      setMoves((v) => v + 1);
    }
  };
  // const handleSaveGame = async () => {
  //   const href = location.href.split('/');
  //   const qstring = href[href.length - 1];

  //   const { name, playerId } = auth.data2;

  //   console.log(auth.data2);

  //   const data = {
  //     playerId,
  //     point: point.score,
  //     name,
  //     router,
  //     qstring,
  //   };

  //   setLoading('Processing...');
  //   await waiting(3000);

  //   try {
  //     dispatch(saveMemory(data));
  //     dispatch(getGameList(playerId));
  //     toast.success('Saved Game!');
  //     setLoading('Redirecting');
  //     await waiting(1000);
  //     router.push('/games');
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <>
      <Head>
        <title>Game land | Memory Game </title>
      </Head>
      <section className='container body col-md-4 col-sm-6 col-12 mt-3'>
        <div>
          <h1 className='text-center text-uppercase text-light mt-3'>
            Memory Game
          </h1>
        </div>
        <div>
          <div className='menu1 text-center text-uppercase text-light mt-3'>
            <p>{`Moves - ${moves}`}</p>
          </div>

          <div className='board1'>
            {boardData.map((data, i) => {
              const flipped = flippedCards.includes(i) ? true : false;
              const matched = matchedCards.includes(i) ? true : false;
              return (
                <div
                  onClick={() => {
                    updateActiveCards(i);
                  }}
                  key={i}
                  className={`card1 ${flipped || matched ? 'active' : ''} ${
                    matched ? 'matched' : ''
                  } ${gameOver ? 'gameover' : ''}`}
                >
                  <div className='card1-front'>{data}</div>
                  <div className='card1-back'></div>
                </div>
              );
            })}
          </div>
          <div className='menu1 text-center text-uppercase text-light mt-3'>
            {/* <p>{`GameOver - ${gameOver}`}</p> */}
            <button onClick={() => initialize()} className='btn'>
              Reset
            </button>
            {/* <button onClick={handleSaveGame} className='btn'>
            {loading}
          </button> */}
          </div>
        </div>
      </section>
    </>
  );
}
