import express, { Request, Response } from 'express';
import cors from 'cors';
import DB from './db.js';
import { update } from './selenium.js';

export class Server {
  db: DB;

  port: number;

  constructor(db: DB, port: number) {
    this.db = db;
    this.port = port;
  }

  async update(res: Response) {
    const { db } = this;
    const [date, obj] = await update();
    await db.add(date, obj);
    res.send('ok');
  }

  async get(res: Response) {
    const data = await this.db.read();
    res.send(data);
  }

  start() {
    const app = express();
    if (process.env.CORS) {
      app.use(cors());
    }
    app.use('/', express.static('public'));
    app.get('/api/get', (req: Request, res: Response) => this.get(res));
    if (process.env.MANUAL_UPDATE) {
      app.get('/api/update', (req: Request, res: Response) => this.update(res));
    }
    app.listen(this.port);
  }
}

export default Server;
