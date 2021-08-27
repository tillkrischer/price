const e = process.env.NODE_ENV;
const base = process.env['REACT_APP_BE_URL'];

export const get = () => {
  console.log({ e });
  console.log({ base });
  console.log(process.env);
};

export default get;
