import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  listAll,
  getMetadata,
} from 'firebase/storage';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { storage } from '../../config/firebase';
import { useRouter } from 'next/router';
import { v4 } from 'uuid';
import styled from 'styled-components';
import Head from 'next/head';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 75vh;
`;

const ListButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.5s ease;
  margin: 10px;
  width: 200px;
  height: 100px;

  &:hover {
    transform: scale(1.1);
  }
`;

const ListFiles = () => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const res = await listAll(ref(storage, 'files/'));

      for (let i = 0; i < res.items.length; i++) {
        const { name } = res.items[i];
        const url = await getDownloadURL(res.items[i]);

        if (!JSON.stringify(data).includes(url)) {
          setData([...data, { url, name }]);
          break;
        }
      }
    }

    fetchData();
  }, [data]);

  return (
    <>
      <Head>
        <title>Game land | File </title>
      </Head>
      <Container>
        {data === 0 ? (
          <h4>No Files Uploaded</h4>
        ) : (
          data.map((e) => {
            return (
              <div key={e + v4()}>
                <Link href={e.url}>
                  <ListButton>{e.name}</ListButton>
                </Link>
              </div>
            );
          })
        )}
      </Container>
    </>
  );
};

export default ListFiles;
