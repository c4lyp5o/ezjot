import { useState } from 'react';
import { toast } from 'react-toastify';
import { BsInfoCircleFill } from 'react-icons/bs';
import axios from 'axios';
import Buttons from './buttons';
import Editor from './editor';

const Info = ({ children }) => {
  return (
    <div className='flex text-sm text-gray-500 mt-2'>
      <span>
        <BsInfoCircleFill className='text-red-600 mr-2' />
      </span>{' '}
      {children}
    </div>
  );
};

export default function Textbox() {
  const [text, setText] = useState('');
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text === '') {
      toast.error('Nothing to save');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/save', {
        pastedText: text,
        mode: 'c',
      });
      setInfo(data);
      toast.success('Saved');
      setText('');
    } catch (err) {
      console.log(err);
      toast.error(`Something went wrong. ${err}`);
    }
    setLoading(false);
  };

  const handleClear = async () => {
    setText('');
    setInfo(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='grid grid-flow-row gap-1'>
        <div className='flex flex-col h-64 overflow-y-auto mb-2'>
          <Editor
            name='yoursoontobetext'
            value={text}
            ro={true}
            onChange={(text) => {
              setText(text);
            }}
          />
        </div>
        <Buttons type='clear' onClick={handleClear} />
        <Buttons type='save' />
        {loading && <p>Saving...</p>}
      </div>
      {info && (
        <div className='flex text-center items-center justify-center mt-2'>
          <Info>
            Key: {info.key}, Pass: {info.password}
          </Info>
        </div>
      )}
    </form>
  );
}
