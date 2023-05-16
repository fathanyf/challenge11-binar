import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { get_player } from '../../store/players/PlayerSlice';
import { selectUser } from '../../store/users/UserSlice';
import Link from 'next/link';
import Image from 'next/image';

const PlayerList = () => {
  const user = useSelector(selectUser);

  const playerData = useSelector((state) => state.player.playerData);
  const playerLoading = useSelector((state) => state.player.loadingPlayerData);
  const dispatch = useDispatch(playerData);

  useEffect(() => {
    dispatch(get_player());
  }, [dispatch]);

  return (
    <div className='card card-danger'>
      {playerLoading ? (
        <div className='d-flex justify-content-center mt-3'>
          <div className='spinner-border text-danger' role='status'>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      ) : (
        playerData &&
        playerData.map((e) => {
          return (
            e.playerId !== user?.uid && (
              <div className='card-body' key={e.id}>
                <div className='user-panel  d-flex'>
                  <div className='image'>
                    <img
                      src={e.avatar}
                      className='img-circle elevation-2'
                      alt='User Image'
                    />
                  </div>
                  <div className='info'>
                    <Link href={{ pathname: '/account', query: { id: e.id } }}>
                      <a className='d-block'>{e.name}</a>
                    </Link>
                  </div>
                </div>
              </div>
            )
          );
        })
      )}
    </div>
  );
};

export default PlayerList;
