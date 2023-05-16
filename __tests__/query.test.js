import '@testing-library/jest-dom';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../src/config/firebase';

describe('Query', () => {
  test('test get user from users', async () => {
    const userDocRef = collection(db, 'users');
    const userData = await getDocs(userDocRef);
    const userList = userData.docs.map((doc) => doc.data());
    const user = userList[0];

    const uid = 'B2SFmux053RyEUJlzhvXX9XrbhJ3';
    expect(user.playerId).toBe(uid); // expected passed
  }),
    test('test get game data from games collection', async () => {
      const gameDocRef = collection(db, 'games');
      const gameData = await getDocs(gameDocRef);
      const gameList = gameData.docs.map((doc) => doc.data());
      const game = gameList[0];

      expect(game.title).toBe('fortnite'); // expected failed
    }),
    test('test get image from images', async () => {
      const imageDocRef = collection(db, 'images');
      const imageData = await getDocs(imageDocRef);
      const imageList = imageData.docs.map((doc) => doc.data());
      const image = imageList[0];

      const post = 'lorem ipsum dolor sit amet';
      expect(image.post).toBe(post); // expected passed
    }),
    test('test get user played any game', async () => {
      const gameDocRef = collection(db, 'games');
      const gameData = await getDocs(gameDocRef);
      const gameList = gameData.docs.map((doc) => doc.data());
      const gameUser = gameList[0].users[0];

      const user = 'IIXSdnchPEUrMIq8ssZupjyrtZ62';
      expect(gameUser).toBe(user); // expected failed
    }),
    test('test get music from musics', async () => {
      const musicDocRef = collection(db, 'musics');
      const musicData = await getDocs(musicDocRef);
      const musicList = musicData.docs.map((doc) => doc.data());
      const music = musicList[2];

      const title = 'hell kitchen';
      expect(music.title).toBe(title); // expected failed
    });
});
