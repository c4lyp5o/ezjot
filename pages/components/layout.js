import Head from 'next/head';

import Header from './header';
import Footer from './footer';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>EZJOT</title>
        <meta name="description" content="jot down everything" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
        <main>{children}</main>
      <Footer />
    </>
  );
}