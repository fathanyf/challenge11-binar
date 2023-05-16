import Head from 'next/head';
import React from 'react';
import GameList from '../../components/game-components/GameList';
import WalkVideosWrapper from '../../components/media-components/VideoWalk';

const GamePage = () => {
  return (
    <>
      <Head>
        <title>Game land | Game List </title>
      </Head>
      <GameList />
      <h1>Video Walkthrough</h1>
      < WalkVideosWrapper />
    </>
  );
};

export default GamePage;
