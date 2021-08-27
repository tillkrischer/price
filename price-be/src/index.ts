import { Server } from './server.js';
import DB from './db.js';

const start = () => {
  const filename = process.env.DB_FILE;
  if (!filename) {
    return;
  }
  const port = Number(process.env.PORT);
  if (!port || port === 0) {
    return;
  }
  const db = new DB(filename);
  const server = new Server(db, port);
  server.start();
};

start();
