import SaveText from '../components/SaveText';
import GetText from '../components/GetText';

function Landing() {
  return (
    <div className='flex flex-col h-screen'>
      <header className='bg-gray-800 text-white text-center py-4 shadow-md'>
        <h1 className='text-xl font-bold'>EZJOT 2.0 - jot down anything</h1>
      </header>
      <div className='grid grid-cols-1 sm:grid-cols-2 flex-1'>
        <div className='border-t border-gray-300 overflow-hidden bg-gray-900 p-4 sm:p-8 sm:border-t-0 sm:border-l'>
          <SaveText />
        </div>
        <div className='border-t border-gray-300 overflow-hidden bg-gray-900 p-4 sm:p-8 sm:border-t-0 sm:border-l'>
          <GetText />
        </div>
      </div>
    </div>
  );
}

export default Landing;
