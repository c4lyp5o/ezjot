import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Buttons from './buttons';
import Editor from './editor';

export default function GetTextBox() {
  const [key, setKey] = useState('');
  const [password, setPassword] = useState('');
  const [entry, setEntry] = useState(null);
  const [show, setShow] = useState(false);
  const [editable, setEditable] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!key) {
      return toast.error('Please enter a key');
    }
    try {
      const { data } = await axios.get(`/api/get?key=${key}&mode=c`);
      setEntry(data);
      setShow(true);
      toast.success('Gottem!');
    } catch (err) {
      console.error(err);
      toast.error('No text found using the key provided!');
    }
  };

  const handleClear = () => {
    setKey('');
    setPassword('');
    setEntry(null);
    setEditable(false);
    setShow(false);
  };

  const checkPassword = async () => {
    if (!password) {
      return toast.error('Please enter a password');
    }
    try {
      await axios.get(`/api/get?key=${key}&password=${password}&mode=r`);
      setEditable(true);
      toast.success('EDIT MODE ON!');
    } catch (err) {
      console.error(err);
      toast.error('Wrong Password!');
    }
  };

  const saveEdit = async () => {
    if (!password) {
      return toast.error('Please enter a password');
    }
    try {
      await axios.post(`/api/save`, {
        pastedText: entry?.pastedText,
        id: entry?.id,
        mode: 'u',
      });
      setEditable(false);
      toast.success('Changes saved!');
    } catch (err) {
      console.error(err);
      setEditable(false);
      toast.error('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='grid grid-flow-row gap-1'>
        <div className='flex flex-col h-64 overflow-y-auto mb-2'>
          {show ? (
            <Editor
              name='yourtext'
              value={entry.pastedText}
              ro={editable}
              onChange={(text) => {
                if (editable) {
                  setEntry({ ...entry, pastedText: text });
                }
              }}
            />
          ) : null}
          <div className='grid grid-cols-2 mb-2 text-center'>
            <label htmlFor='key' className='text-gray-500'>
              Key:{' '}
              <input
                className='border-2 border-lime-500 rounded-md m-auto'
                name='key'
                type='text'
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </label>
            <label htmlFor='password' className='text-gray-500'>
              Password:{' '}
              <input
                className='border-2 border-lime-500 rounded-md m-auto'
                name='password'
                type='text'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          <div className='grid grid-row-2 gap-1'>
            <button
              className='bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded mt-2'
              type='button'
              onClick={async (e) => checkPassword()}
            >
              Edit Text {editable ? '✅' : '❌'}
            </button>
            <Buttons type='clear' onClick={handleClear} />
            {editable ? (
              <Buttons type='saveEdit' onClick={saveEdit} />
            ) : (
              <Buttons type='get' />
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
