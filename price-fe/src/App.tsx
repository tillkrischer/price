import { useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';

import { Data, get } from './client';
import { PriceTable } from './PriceTable';
import { ValueTable } from './ValueTable';

export const App = () => {
  const [data, setData] = useState<Data | null>(null);
  const [mode, setMode] = useState<string>('price');

  useEffect(() => {
    const load = async () => {
      const res = await get();
      setData(res);
    };
    load();
  }, []);

  const onModeChange = useCallback((e) => {
    setMode(e.target.value);
  }, []);

  return (
    <div>
      <ModeRadioButtons onModeChange={onModeChange} />
      {mode === 'price' ? <PriceTable data={data} /> : <ValueTable data={data} />}
    </div>
  );
};

const ModeRadioButtons = (props: { onModeChange: (e: any) => void }) => {
  const { onModeChange } = props;
  return (
    <div onChange={onModeChange}>
      <input type="radio" value="price" name="mode" defaultChecked />
      <label>Price</label>
      <input type="radio" value="value" name="mode" />
      <label>Value</label>
    </div>
  );
};

export default App;
