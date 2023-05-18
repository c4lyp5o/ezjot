import Head from 'next/head';
import { Fragment } from 'react';

import Textbox from './components/textbox';
import GetTextBox from './components/gettext';

export default function Home() {
  return (
    <Fragment>
      <Head>
        <title>EZJOT</title>
        <link rel='icon' href='/favicon.ico' />
        <meta charset='UTF-8' />
        <meta name='description' content='NextJS Head component' />
        <meta
          name='keywords'
          content='EZJOT, jot, down, anything, simple, easy, secure, text, textbin,
          textbin.io, textbinio'
        />
        <meta name='author' content='c4lyp5o' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <main className='flex flex-col items-center justify-center w-full h-screen bg-black'>
        <div className='m-4'>
          <h1 className='text-6xl font-bold text-white'>EZJOT</h1>
          <p className='text-2xl text-white'>jot down anything</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center w-full md:w-3/4 h-full'>
          <Textbox />
          <GetTextBox />
        </div>
      </main>
    </Fragment>
  );
}
