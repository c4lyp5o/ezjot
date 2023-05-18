import Head from 'next/head';
import { Fragment } from 'react';

import Textbox from './components/textbox';
import GetTextBox from './components/gettext';

export default function Home() {
  return (
    <Fragment>
      <Head>
        <title>EZJOT</title>
        <description>
          EZJOT is a simple, easy to use, and secure way to jot down anything
        </description>{' '}
        <keywords>
          EZJOT, jot, down, anything, simple, easy, secure, text, textbin,
          textbin.io, textbinio, textbin.io, textbinio, textbin, textbin.io,
          textbinio, textbin.io, textbinio, textbin, textbin.io, textbinio,
          textbin.io, textbinio, textbin, textbin.io, textbinio, textbin.io,
          textbinio, textbin, textbin.io, textbinio, textbin.io, textbinio,
          textbin, textbin.io, textbinio, textbin.io, textbinio, textbin,
          textbin.io, textbinio, textbin.io, textbinio
        </keywords>{' '}
        <author>c4lyp5o</author>
      </Head>
      <main className='flex flex-col items-center justify-center w-full h-screen bg-black'>
        <div className='m-4'>
          <h1 className='text-6xl font-bold text-white'>EZJOT</h1>
          <p className='text-2xl text-white'>jot down anything</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-1 items-center justify-center w-full md:w-3/4 h-full'>
          <Textbox />
          <GetTextBox />
        </div>
      </main>
    </Fragment>
  );
}
