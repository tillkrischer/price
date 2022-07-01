import styled from 'styled-components';
import { useMemo } from 'react';
import { Data } from './client';

const Table = styled.table``;

const TableHead = styled.th`
  text-align: center;
`;

const TableCell = styled.td`
  text-align: end;
  padding: 0px;
`;

const TableRow = styled.tr``;

const ColorTableCell = styled(TableCell)`
  background-color: ${(props) => props.color};
`;

const columns = ['3090 Ti', '3090', '3080 Ti', '3080', '3070 Ti', '3070', '3060 Ti', '3060', '3050'];

const relValues: { [key: string]: number } = {
  '3090 Ti': 272,
  '3090': 240,
  '3080 Ti': 239,
  '3080': 209,
  '3070 Ti': 170,
  '3070': 158,
  '3060 Ti': 135,
  '3060': 100,
  '3050': 72,
};

export const ValueTable = (props: { data: Data | null }) => {
  const { data } = props;
  const [valueData, maxValue, minValue] = useMemo(() => {
    if (data) {
      return computeValueData(data);
    }
    return [null, null, null];
  }, [data]);
  return (
    <Table>
      <thead>
        <TableRow>
          <TableHead>Date</TableHead>
          {columns.map((col) => (
            <TableHead key={col}>{col}</TableHead>
          ))}
        </TableRow>
      </thead>
      <tbody>
        {valueData &&
          Object.entries(valueData).map(([date, values]) => {
            return (
              <TableRow key={date}>
                <TableCell>{date}</TableCell>
                {columns.map((col) => {
                  const value = values[col];
                  if (value && minValue && maxValue) {
                    const color = computeColor(value, minValue, maxValue);
                    return (
                      <ColorTableCell key={col} color={color}>
                        {value.toFixed(5)}
                      </ColorTableCell>
                    );
                  }
                  return <TableCell key={col} />;
                })}
              </TableRow>
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
