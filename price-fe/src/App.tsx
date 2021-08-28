import { useState } from 'react';
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

const RootContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const columns = ['3090', '3080 Ti', '3080', '3070 Ti', '3070', '3060 Ti', '3060'];

export const App = () => {
  const [data, setData] = useState<Data>();
  useEffect(() => {
    const load = async () => {
      const res = await get();
      setData(res);
    };
    load();
  }, []);

  return (
    <RootContainer>
      <Table>
        <tr>
          <TableHead>Date</TableHead>
          {columns.map((col) => (
            <TableHead>{col}</TableHead>
          ))}
        </tr>
        {data &&
          Object.entries(data).map(([date, values]) => {
            return (
              <tr>
                <TableCell>{date}</TableCell>
                {columns.map((col) => {
                  return <TableCell>{values[col]}</TableCell>;
                })}
              </tr>
            );
          })}
      </Table>
    </RootContainer>
  );
};

export default App;
