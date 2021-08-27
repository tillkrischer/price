import { Low, JSONFile } from 'lowdb';

type Data = {
  prices: number[];
};

export const init = async () => {
  const file = process.env.DB_FILE;
  if (file) {
    const adapter = new JSONFile<Data>(file);
    const db = new Low<Data>(adapter);
    await db.read();

    db.data ||= { prices: [] };

    await db.write();
  }
};
