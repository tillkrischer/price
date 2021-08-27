import { Low, JSONFile } from 'lowdb';

type Data = {
  prices: number[];
};

export const init = async () => {
  const filename = process.env.DB_FILE;
  if (filename) {
    const adapter = new JSONFile<Data>(filename);
    const db = new Low<Data>(adapter);
    await db.read();
    db.data ||= { prices: [] };
    await db.write();
  }
};
