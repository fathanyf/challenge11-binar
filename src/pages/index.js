import Head from 'next/head';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import GameList from '../components/game-components/GameList';

export default function Home() {
  const userData = useSelector((state) => state.user.user);

  console.log(userData);
  return (
    <>
      <Head>
        <title>Game Land | free online gaming</title>
      </Head>
      <div>
        <header className='showcase'>
          <div className='showcase-top'>
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img src='/logoch11.png' alt='logo' style={{ width: '325px' }} />
            <Link href='/auth/signin'>
              <a className='btn btn-rounded'>Sign In</a>
            </Link>
          </div>
          <div className='showcase-content'>
            <h1>Next level Gaming</h1>
            <p>Free Trial all games for 30 days</p>
            <Link href='/auth/signup'>
              <a className='btn btn-xl'>
                Sign up for free <i className='fas fa-chevron-right btn-icon' />
              </a>
            </Link>
          </div>
        </header>
      </div>
      <section className='feature-section spad'>
        <>
          <GameList />
        </>
      </section>
    </>
  );
}
