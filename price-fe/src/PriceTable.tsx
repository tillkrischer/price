import styled from 'styled-components';
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

const columns = ['3090', '3080 Ti', '3080', '3070 Ti', '3070', '3060 Ti', '3060', '3050'];

export const PriceTable = (props: { data: Data | null }) => {
  const { data } = props;
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
        {data &&
          Object.entries(data).map(([date, values]) => {
            return (
              <TableRow key={date}>
                <TableCell>{date}</TableCell>
                {columns.map((col) => {
                  let value = values[col];
                  if (value !== null && value !== undefined) {
                    return <TableCell key={col}>{Math.round(value)}</TableCell>;
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
