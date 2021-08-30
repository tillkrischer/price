import schedule from 'node-schedule';
import { Server } from './server.js';
import DB from './db.js';
import { update } from './selenium.js';

const setUpSchedule = (db: DB) => {
  schedule.scheduleJob('0 6 * * *', async () => {
    // eslint-disable-next-line no-console
    console.log(new Date(), 'running update');
    const [date, obj] = await update();
    await db.add(date, obj);
  });
};

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

  setUpSchedule(db);

  const server = new Server(db, port);
  server.start();
};

start();
