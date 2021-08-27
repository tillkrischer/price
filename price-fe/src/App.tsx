import { useEffect } from 'react';
import { get } from './client';

export const App = () => {
  useEffect(() => {
    get();
  }, []);
  return <div>hello world</div>;
};

export default App;
