import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { get_leader_board } from '../../store/players/PlayerSlice';
import moment from 'moment';
import { selectUser } from '../../store/users/UserSlice';
import Image from 'next/image';

const LeaderBoard = () => {
  const user = useSelector(selectUser);

  const leaderBoard = useSelector((state) => state.player.leaderBoard);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_leader_board());
  }, [, dispatch]);

  return (
    <div className='card card-danger'>
      {leaderBoard.map((e, index) => {
        return (
          <div className='card-body p-0' key={index}>
            <ul
              className='products-list product-list-in-card pl-2 pr-2'
              key={index}
            >
              <li className='item'>
                {e.point === 0 ? (
                  <>
                    {/* <div className="product-img">
                                                                        <img src='/blank-avatar.svg' alt="Product Image" className="img-size-50" />
                                                                    </div>
                                                                    <div className="product-info">
                                                                        <a href="" className="product-title">{e.name}
                                                                            <span className="badge badge-warning float-right">0</span></a>
                                                                        <span className="product-description">
                                                                            <small><span><b>Update at : </b></span>00:00:00</small>
                                                                        </span>
                                                                    </div> */}
                  </>
                ) : (
                  <>
                    <div className='product-img'>
                      <Image
                        width='50'
                        height='50'
                        src={e.avatar}
                        alt='Product Image'
                        className='img-size-50'
                      />
                    </div>
                    <div className='product-info'>
                      <a className='product-title'>
                        {e.name}
                        <span className='badge badge-warning float-right'>
                          {e.totalpoint}
                        </span>
                      </a>
                    </div>
                  </>
                )}
              </li>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderBoard;
