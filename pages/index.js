import Head from 'next/head';

import Textbox from './components/textbox';
import GetTextBox from './components/gettext';

export default function Home() {
  return (
    <>
      <Head
        title='EZJOT'
        description='EZJOT is a simple, easy to use, and secure way to jot down anything.'
        keywords='EZJOT, jot, down, anything, simple, easy, secure, text, textbin, textbin.io, textbinio, textbin.io, textbinio, textbin, textbin.io, textbinio, textbin.io, textbinio, textbin, textbin.io, textbinio, textbin.io, textbinio, textbin, textbin.io, textbinio, textbin.io, textbinio, textbin, textbin.io, textbinio, textbin.io, textbinio, textbin, textbin.io, textbinio, textbin.io, textbinio, textbin, textbin.io, textbinio, textbin.io, textbinio'
        author='c4lyp5o'
      />
      <title className='hidden'>EZJOT</title>
      <main className='flex flex-col items-center justify-center w-full h-screen bg-black'>
        <h1 className='text-6xl font-bold text-white'>EZJOT</h1>
        <p className='text-2xl text-white'>jot down anything</p>
        <article className='grid grid-cols-2 gap-16 items-center justify-center w-3/4 h-full'>
          <Textbox />
          <GetTextBox />
        </article>
      </main>
    </>
  );
}
