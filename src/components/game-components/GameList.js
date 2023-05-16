import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getGameList } from '../../store/games/GamesSlice';
import Link from 'next/link';
import { totalReset } from '../../store/point/PointSlicer';
import Image from 'next/image';

const GameList = () => {
  const data = useSelector((state) => state.games.games);
  const auth = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [playedGames, setPlayedGames] = useState(false);

  useEffect(() => {
    dispatch(getGameList(auth.user?.uid));
  }, [auth.user?.uid, dispatch]);

  return (
    <>
      <div className='container'>
        <div className='row mt-3'>
          <div className='col-lg-12'>
            <div className='product__page__content'>
              <div className=''>
                <div className='row'>
                  <div className='col-lg-10 col-md-10 col-sm-6'>
                    <div className='section-title'>
                      <h4>Recomended Games</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                {data &&
                  data.map((e) => {
                    return (
                      <div className='col-lg-3 col-md-6 col-sm-6' key={e.id}>
                        <Link href={`/games/${e.link}`}>
                          <div
                            className='product__item'
                            style={{ cursor: 'pointer' }}
                          >
                            {/* <img src={e.imageUrl} alt="" /> */}
                            <div
                              className='product__item__pic set-bg'
                              data-setbg='/3.jpg'
                              style={{ backgroundImage: `url(${e.imageUrl})` }}
                            >
                              <div className='ep'>
                                5 <i className='fas fa-star'></i>
                              </div>
                              <div className='comment'>
                                <i className='fa fa-comments' /> 22
                              </div>
                              <div className='view'>
                                <i className='fa fa-eye' /> 1635
                              </div>
                            </div>
                            <div className='product__item__text'>
                              <ul>
                                <li>{e.developer}</li>
                                <li>{e.genre}</li>
                              </ul>
                              <h5>
                                <a href='#'>{e.title}</a>
                              </h5>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameList;
