import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { get_game_board } from '../../store/games/GamesSlice';
import moment from 'moment';
import { selectUser } from '../../store/users/UserSlice';
import Image from 'next/image';
import { useRouter } from 'next/router';

const GameBoard = () => {
  const user = useSelector(selectUser);
  const router = useRouter();

  let { id } = router.query;

  const gamesBoard = useSelector((state) => state.games.gamesBoard);
  const loadingGameBoard = useSelector(
    (state) => state.games.loadingGamesBoard
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(get_game_board(id));
    }
  }, [dispatch, id]);

  return (
    <div className='card-body'>
      {loadingGameBoard ? (
        <div className='d-flex justify-content-center mt-3'>
          <div className='spinner-border text-danger' role='status'>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      ) : (
        gamesBoard &&
        gamesBoard.map((e) => {
          return (
            <div className='direct-chat-msg' key={e.id}>
              <div className='direct-chat-infos clearfix'>
                <span className='direct-chat-name float-left'>{e.name}</span>
                <span className='direct-chat-timestamp float-right'>
                  {moment(e.createdAt.toDate()).fromNow()}
                </span>
              </div>
              {!e.avatar ? (
                <img
                  className='direct-chat-img'
                  src='/blank-avatar.svg'
                  alt='message user image'
                />
              ) : (
                <img
                  className='direct-chat-img'
                  src={e.avatar}
                  alt='message user image'
                />
              )}
              <div className='direct-chat-text'>
                <p className='text-center'>
                  <i className='fas fa-gamepad'></i>:{' '}
                  <span className='badge badge-secondary'> {e.playCount}</span>
                  <i className='fas fa-thumbs-up ml-4'></i> :{' '}
                  <span className='badge badge-success'>{e.userWin}</span>{' '}
                  <i className='fas fa-handshake ml-4'></i> :{' '}
                  <span className='badge badge-info'>{e.userDraw}</span>{' '}
                  <i className='fas fa-thumbs-down ml-4'></i> :{' '}
                  <span className='badge badge-danger'>{e.userLoss}</span>{' '}
                  <i className='fas fa-award ml-4'></i> :{' '}
                  <span className='badge badge-primary'>{e.point}</span>
                </p>
              </div>
              <hr />
            </div>
          );
        })
      )}
    </div>
  );
};

export default GameBoard;
