function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4'>
      <h1 className='text-4xl font-bold text-gray-800 mb-4'>404</h1>
      <p className='text-lg text-gray-600 mb-6'>
        Oops! The page you're looking for doesn't exist.
      </p>
      <a
        href='/'
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
      >
        Go Back Home
      </a>
    </div>
  );
}

export default NotFound;
