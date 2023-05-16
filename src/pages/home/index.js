import React from 'react';
import Image from 'next/image';
import Head from 'next/head';

const Home = () => {
  return (
    <>
      <Head>
        <title>Game land | Home </title>
      </Head>
      <section
        className=''
        data-setbg='img/normal-breadcrumb.jpg'
        style={{
          backgroundImage: 'url("https://wallpapercave.com/wp/wp6404430.png")',
          height: '550px',
          opacity: '0.9',
        }}
      >
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12 text-center'>
              <div className='showcase-content'>
                <h2 className='text-uppercase'>Work Hard</h2>
                <h1 className='text-uppercase'>Play Harder</h1>
                <p>Best choice for gaming platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
