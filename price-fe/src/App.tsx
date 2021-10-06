import { useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

import { Data, get } from './client';
import { PriceTable } from './PriceTable';
import { ValueTable } from './ValueTable';

const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
`;

const ContentContainer = styled.div`
  width: 800px;
`;

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
    // <RootContainer>
    //   <SideContainer>
    //     <ModeRadioButtons onModeChange={onModeChange} />
    //   </SideContainer>
    //   {mode === 'price' ? <PriceTable data={data} /> : <ValueTable data={data} />}
    //   <SideContainer />
    // </RootContainer>
    <RootContainer>
      <ContentContainer>
        <ModeRadioButtons onModeChange={onModeChange} />
        {mode === 'price' ? <PriceTable data={data} /> : <ValueTable data={data} />}
      </ContentContainer>
    </RootContainer>
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
