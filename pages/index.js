import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

import Textbox from './components/textbox'
import GetTextBox from './components/gettext'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>EZJOT</title>
        <meta name="description" content="jot down everything" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='flex flex-col items-center justify-center w-full h-screen mt-3'>
        <h1 className='text-6xl font-bold'>EZJOT</h1>
        <p className='text-2xl'>jot down anything</p>
        <article className='grid grid-cols-2 gap-16 items-center justify-center w-3/4 h-full'>
          <Textbox />
          <GetTextBox />
        </article>          
      </main>
    </>
  )
}
