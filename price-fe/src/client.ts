const base = process.env['REACT_APP_BE_URL'];

export type Entry = {
  [key: string]: number | null;
};

export type Data = {
  [key: string]: Entry;
};

export const get = async () => {
  const data = await fetch(base + 'api/get')
    .then((res) => res.json())
    .then((data) => {
      return data as Data;
    });
  return data;
};
