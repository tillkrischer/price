import { Low, JSONFile } from 'lowdb';

export type Entry = {
  [key: string]: number | null;
};

export type Data = {
  [key: string]: Entry;
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

  async add(date: string, obj: Entry) {
    const { db } = this;
    await db.read();
    db.data ||= {};
    if (!(date in db.data)) {
      db.data[date] = obj;
      await db.write();
    }
  }
}

export default DB;
