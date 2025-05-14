import { useState } from 'react';
import { toast } from 'react-toastify';
import TextDisplay from './TextDisplay';

export default function GetText() {
  const [allInfo, setAllInfo] = useState({
    key: '',
    password: '',
    text: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!allInfo.key) return toast.error('Please enter a key');

    setLoading(true);

    try {
      const response = await fetch('/api/v1/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: allInfo.key,
          password: allInfo.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const text = await response.json();
      setAllInfo({
        ...allInfo,
        text,
      });
      toast.success('Gottem!');
    } catch (error) {
      //   console.error('Error during get operation:', error);
      toast.error('No text found using the key provided!');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setAllInfo({
      key: '',
      password: '',
      text: '',
    });
  };

  return (
    <>
      <TextDisplay
        allInfo={allInfo}
        setAllInfo={setAllInfo}
        loading={loading}
        handleSubmit={handleSubmit}
        handleClear={handleClear}
        aria-label='Text Display'
      />
    </>
  );
}
