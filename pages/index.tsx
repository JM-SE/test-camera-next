/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
// import SelfieHooks from '../src/components/SelfieHooks';
import { StoreStateContext } from '../src/store/Store';

const Home: NextPage = () => {
  const { token, addToken } = useContext(StoreStateContext);

  const postTokenRenaper = async () => {
    try {
      const user = {
        username: 'scrostrotst',
        password: 'o19E5B3#iIL%$(O',
      } as any;

      let formBody = [] as any;
      for (let property in user) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(user[property]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');

      const response = await fetch(
        'https://apirenaper.idear.gov.ar/CHUTROFINAL/API_ABIS/Autorizacion/token.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: 'PHPSESSID=1a8ef82fd63a92123b137fb151013430',
          },
          body: formBody,
        }
      );

      const data = await response.json();

      console.log(data);

      if (data?.data.token) {
        return addToken(data.data.token);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    postTokenRenaper();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Link href="/selfie" passHref>
          <button style={{ padding: '5px 10px 5px 10px' }} disabled={!token}>
            Camera test
          </button>
        </Link>
        {token ? (
          <div style={{ padding: '5px 10px 5px 10px' }}>Token ok</div>
        ) : (
          <div style={{ padding: '5px 10px 5px 10px' }}>No hay token</div>
        )}
      </main>
    </div>
  );
};

export default Home;
