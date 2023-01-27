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
    if (key === '') {
      return toast.error('Please enter a key');
    }
    try {
      const res = await axios.get(`/api/get?key=${key}&mode=c`);
      setEntry(res.data);
      setShow(true);
      toast.success('Gottem!');
    } catch (err) {
      console.log(err);
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

  const checkPassword = async (e) => {
    if (password === '') {
      return toast.error('Please enter a password');
    }
    try {
      const res = await axios.get(
        `/api/get?key=${key}&password=${password}&mode=r`
      );
      setEditable(true);
      toast.success('EDIT MODE ON!');
    } catch (err) {
      console.log(err);
      toast.error('Wrong Password!');
    }
  };

  const saveEdit = async (e) => {
    if (password === '') {
      return toast.error('Please enter a password');
    }
    try {
      const res = await axios.post(`/api/save`, {
        pastedText: entry.pastedText,
        id: entry.id,
        mode: 'u',
      });
      setEditable(false);
      toast.success('Changes saved!');
    } catch (err) {
      console.log(err);
      setEditable(false);
      toast.error('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-flow-row gap-1">
        <div className="grid grid-flow-col gap-5 mb-2">
          <label htmlFor="key" className="text-gray-500">
            Key:{' '}
          </label>
          <input
            className="border-2 border-lime-500 rounded-md"
            name="key"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <label htmlFor="password" className="text-gray-500">
            Password:{' '}
          </label>
          <input
            className="border-2 border-lime-500 rounded-md"
            name="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={async (e) => checkPassword()}
          >
            Edit Text {editable ? '✅' : '❌'}
          </button>
        </div>
        {show ? (
          <Editor
            name="yourtext"
            value={entry.pastedText}
            ro={editable}
            onChange={(text) => {
              if (editable) {
                setEntry({ ...entry, pastedText: text });
              }
            }}
          />
        ) : null}
        <Buttons type="clear" onClick={handleClear} />
        {editable ? (
          <Buttons type="saveEdit" onClick={saveEdit} />
        ) : (
          <Buttons type="get" />
        )}
      </div>
    </form>
  );
}
