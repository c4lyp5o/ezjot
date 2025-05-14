import React, { useState, useCallback } from 'react';

const Spinner = () => (
  <svg
    className='animate-spin h-4 w-4 mr-2 text-white'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    aria-label='Loading'
  >
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
    ></circle>
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8v8z'
    ></path>
  </svg>
);

const TextEditor = ({
  allInfo,
  setAllInfo,
  loading,
  handleClear,
  handleSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const maxCharacters = 1000;
  const characterCount = allInfo.text.length;

  const handleTextChange = useCallback(
    (event) => {
      setAllInfo({
        ...allInfo,
        text: event.target.value,
      });
    },
    [allInfo, setAllInfo]
  );

  const handlePasswordChange = useCallback(
    (event) => {
      setAllInfo({
        ...allInfo,
        password: event.target.value,
      });
    },
    [allInfo, setAllInfo]
  );

  const handleBurnAfterReadingChange = useCallback(
    (event) => {
      setAllInfo({
        ...allInfo,
        burnAfterReading: event.target.checked,
      });
    },
    [allInfo, setAllInfo]
  );

  const handleShowPasswordToggle = () => setShowPassword((prev) => !prev);

  return (
    <div className='flex flex-col items-center justify-center p-5 bg-gray-100 border border-gray-300 rounded-lg shadow-md w-11/12 mx-auto'>
      <label htmlFor='yoursoontobetext' className='sr-only'>
        Text Area
      </label>
      <textarea
        className='w-full h-48 p-3 text-base font-mono text-gray-800 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        style={{ lineHeight: '1.5', height: '12rem' }}
        value={allInfo.text}
        onChange={handleTextChange}
        onKeyDown={(event) => {
          if (
            (event.key === 'Enter' && event.shiftKey) ||
            (event.key === 'Enter' && event.ctrlKey)
          ) {
            event.preventDefault();
            handleSubmit();
          }
        }}
        rows={4}
        cols={50}
        name='yoursoontobetext'
        id='yoursoontobetext'
        readOnly={false}
        autoComplete='off'
        autoCorrect='off'
        spellCheck='false'
        autoCapitalize='none'
        maxLength={maxCharacters}
        placeholder='Paste your text here...'
        aria-label='Text Area'
      />
      <div className='w-full text-right text-xs text-gray-500 mt-1'>
        {characterCount}/{maxCharacters} characters
      </div>
      <label htmlFor='password-input' className='sr-only'>
        Password
      </label>
      <div className='relative w-full mt-4'>
        <input
          type={showPassword ? 'text' : 'password'}
          className='w-full p-4 text-base text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12'
          value={allInfo.password}
          onChange={handlePasswordChange}
          placeholder='Enter a password (optional)'
          id='password-input'
          aria-label='Password (optional)'
          autoComplete='off'
          disabled={loading}
        />
        <button
          type='button'
          className='absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 bg-gray-200 rounded px-2 py-1 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          onClick={handleShowPasswordToggle}
          disabled={loading || allInfo.password === ''}
          tabIndex={-1}
          aria-pressed={showPassword}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className='flex items-center mt-4'>
        <input
          type='checkbox'
          id='burnAfterReading'
          className='mr-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
          checked={allInfo.burnAfterReading}
          onChange={handleBurnAfterReadingChange}
          aria-checked={allInfo.burnAfterReading}
          aria-label='Burn after reading'
        />
        <label htmlFor='burnAfterReading' className='text-gray-700'>
          Burn after reading
        </label>
      </div>
      <div className='flex justify-between w-full mt-4'>
        <button
          type='button'
          className='px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          onClick={handleClear}
          aria-label='Clear Text'
        >
          Clear
        </button>
        <button
          type='button'
          className='px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center'
          onClick={handleSubmit}
          disabled={loading}
          aria-label='Save Text'
          aria-disabled={loading}
        >
          {loading ? <Spinner /> : null}
          Save Text
        </button>
      </div>
      <div className='w-full text-xs text-gray-600 text-right mt-1'>
        Use Shift+Enter or Ctrl+Enter to save.
      </div>
    </div>
  );
};

export default TextEditor;
