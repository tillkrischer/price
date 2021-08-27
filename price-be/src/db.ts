import { Low, JSONFile } from 'lowdb';

type Data = {
  [key: string]: {
    [key: string]: number;
  };
};

export class DB {
  adapter: JSONFile<Data>;

  db: Low<Data>;

  constructor(filename: string) {
    this.adapter = new JSONFile(filename);
    this.db = new Low(this.adapter);
  }

  async init() {
    const { db } = this;
    await db.read();
    db.data ||= {};
    await db.write();
  }

  async read() {
    const { db } = this;
    await db.read();
    return db.data;
  }
}

export default DB;
