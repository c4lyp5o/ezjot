import React, { useRef } from 'react';

const TextDisplay = ({
  allInfo,
  setAllInfo,
  loading,
  handleClear,
  handleSubmit,
}) => {
  const maxCharacters = 1000;
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);

  const handleKeyChange = (event) => {
    setAllInfo({
      ...allInfo,
      key: event.target.value,
    });
  };

  const handlePasswordChange = (event) => {
    setAllInfo({
      ...allInfo,
      password: event.target.value,
    });
  };

  const handleScroll = (e) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.target.scrollTop;
    }
  };

  return (
    <div className='flex flex-col items-center justify-center p-5 bg-gray-100 border border-gray-300 rounded-lg shadow-md w-11/12 mx-auto'>
      <label htmlFor='yoursoontobetext' className='sr-only'>
        Text Output
      </label>
      <div className='relative w-full flex' style={{ height: '12rem' }}>
        {/* Line numbers gutter */}
        <div
          ref={gutterRef}
          className='flex flex-col items-end bg-gray-200 rounded-l-md select-none text-gray-500 font-mono text-base pt-3 pb-3 border border-r-0 border-gray-300 overflow-y-auto hide-scrollbar'
          style={{
            minWidth: '2.5em',
            lineHeight: '1.5',
            height: '100%',
            scrollbarWidth: 'none',
          }}
        >
          {Array.from(
            { length: loading ? 1 : allInfo.text?.split('\n').length || 1 },
            (_, i) => (
              <span key={i} className='h-6 leading-6 mr-2'>
                {i + 1}
              </span>
            )
          )}
        </div>
        {/* Text area */}
        <textarea
          ref={textareaRef}
          className='w-full p-3 text-base font-mono text-gray-800 border border-gray-300 rounded-r-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 overflow-y-auto'
          style={{ lineHeight: '1.5', height: '100%' }}
          value={loading ? 'Loading...' : allInfo.text}
          rows={4}
          cols={50}
          name='yoursoontobetext'
          id='yoursoontobetext'
          readOnly={true}
          autoComplete='off'
          autoCorrect='off'
          spellCheck='false'
          autoCapitalize='none'
          maxLength={maxCharacters}
          placeholder='Get your text here...'
          aria-label='Text output area'
          onScroll={handleScroll}
        />
      </div>
      <div className='flex w-full mt-2 justify-end'>
        <button
          type='button'
          className='px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          onClick={() => {
            if (allInfo.text) {
              navigator.clipboard.writeText(allInfo.text);
            }
          }}
          aria-label='Copy text to clipboard'
          disabled={!allInfo.text || loading}
        >
          Copy
        </button>
      </div>
      <label htmlFor='key-input' className='sr-only'>
        Key
      </label>
      <input
        type='text'
        className='w-full mt-4 p-4 text-base text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
        value={allInfo.key}
        onChange={handleKeyChange}
        placeholder='Enter key'
        id='key-input'
        aria-label='Enter key'
        autoComplete='off'
        required
        disabled={loading}
      />
      <label htmlFor='password-input-main' className='sr-only'>
        Password (optional)
      </label>
      <div className='relative w-full mt-4'>
        <input
          type={allInfo.showPassword ? 'text' : 'password'}
          className='w-full p-4 text-base text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12'
          value={allInfo.password}
          onChange={handlePasswordChange}
          placeholder='Enter password (optional)'
          id='password-input-main'
          aria-label='Enter password (optional)'
          autoComplete='off'
          disabled={loading}
        />
        <button
          type='button'
          className='absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 bg-gray-200 rounded px-2 py-1 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          onClick={() =>
            setAllInfo({ ...allInfo, showPassword: !allInfo.showPassword })
          }
          disabled={loading || allInfo.password === ''}
          tabIndex={-1}
          aria-pressed={allInfo.showPassword}
          aria-label={allInfo.showPassword ? 'Hide password' : 'Show password'}
        >
          {allInfo.showPassword ? 'Hide' : 'Show'}
        </button>
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
          className='px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          onClick={handleSubmit}
          disabled={loading}
          aria-label='Get text'
          aria-disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Text'}
        </button>
      </div>
    </div>
  );
};

export default TextDisplay;
