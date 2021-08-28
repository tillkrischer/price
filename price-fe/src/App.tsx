import { useState } from 'react';
import { useCallback } from 'react';
import { useMemo } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { Data, get } from './client';

const Table = styled.table`
  border: 1px solid black;
  border-collapse: collapse;
`;

const TableHead = styled.th`
  border: 1px solid black;
`;

const TableCell = styled.td`
  border: 1px solid black;
  width: 10rem;
  text-align: end;
`;

const ColorTableCell = styled(TableCell)`
  background-color: ${(props) => props.color};
`;

const RootContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SideContainer = styled.div`
  width: 10rem;
`;

const columns = ['3090', '3080 Ti', '3080', '3070 Ti', '3070', '3060 Ti', '3060'];

const relValues: { [key: string]: number } = {
  '3090': 240,
  '3080 Ti': 239,
  '3080': 209,
  '3070 Ti': 170,
  '3070': 158,
  '3060 Ti': 135,
  '3060': 100,
};

const computeValueData = (data: Data): [Data, number, number] => {
  let maxValue = -Infinity;
  let minValue = Infinity;
  const valueData: Data = JSON.parse(JSON.stringify(data));

  for (const date of Object.keys(valueData)) {
    const entry = valueData[date];
    if (entry) {
      for (const model of Object.keys(entry)) {
        const price = entry[model];
        const relValue = relValues[model];
        if (price && relValue) {
          const value = relValue / price;
          maxValue = Math.max(maxValue, value);
          minValue = Math.min(minValue, value);
          entry[model] = value;
        }
      }
    }
  }
  return [valueData, maxValue, minValue];
};

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

  const [valueData, maxValue, minValue] = useMemo(() => {
    if (data) {
      return computeValueData(data);
    }
    return [null, null, null];
  }, [data]);

  const onModeChange = useCallback((e) => {
    setMode(e.target.value);
  }, []);

  return (
    <RootContainer>
      <SideContainer>
        <div onChange={onModeChange}>
          <div>
            <input type="radio" value="price" name="mode" defaultChecked /> Price
          </div>
          <div>
            <input type="radio" value="value" name="mode" /> Value
          </div>
        </div>
      </SideContainer>
      {mode === 'price' ? (
        <PriceTable data={data} />
      ) : (
        <ValueTable data={valueData} minValue={minValue} maxValue={maxValue} />
      )}
      <SideContainer />
    </RootContainer>
  );
};

const PriceTable = (props: { data: Data | null }) => {
  const { data } = props;
  return (
    <Table>
      <tr>
        <TableHead>Date</TableHead>
        {columns.map((col) => (
          <TableHead>{col}</TableHead>
        ))}
      </tr>
      <tbody>
        {data &&
          Object.entries(data).map(([date, values]) => {
            return (
              <tr>
                <TableCell>{date}</TableCell>
                {columns.map((col) => {
                  let value = values[col];
                  if (value !== null && value !== undefined) {
                    return <TableCell>{Math.round(value)}</TableCell>;
                  }
                  return <TableCell />;
                })}
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};

const computeColor = (value: number, min: number, max: number) => {
  const frac = (value - min) / (max - min);
  let red = 0;
  let green = 0;
  if (frac < 0.5) {
    red = 1;
    green = frac * 2;
  } else {
    green = 1;
    red = 1 - frac;
  }
  return `rgba(${red * 255},${green * 255},0,0.7)`;
};

const ValueTable = (props: {
  data: Data | null;
  minValue: number | null;
  maxValue: number | null;
}) => {
  const { data, minValue, maxValue } = props;
  return (
    <Table>
      <tr>
        <TableHead>Date</TableHead>
        {columns.map((col) => (
          <TableHead>{col}</TableHead>
        ))}
      </tr>
      <tbody>
        {data &&
          Object.entries(data).map(([date, values]) => {
            return (
              <tr>
                <TableCell>{date}</TableCell>
                {columns.map((col) => {
                  const value = values[col];
                  if (value && minValue && maxValue) {
                    const color = computeColor(value, minValue, maxValue);
                    return <ColorTableCell color={color}>{value.toFixed(5)}</ColorTableCell>;
                  }
                  return <TableCell />;
                })}
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};

export default App;
