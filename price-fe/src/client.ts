const base = process.env['REACT_APP_BE_URL'];

export const get = async () => {
  const data = await fetch(base + 'api/get').then((res) => res.json());
  console.log(data);
};

export default get;
