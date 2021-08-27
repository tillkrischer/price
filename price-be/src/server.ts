import express, { Request, Response } from 'express';
import cors from 'cors';
import DB from './db.js';

export class Server {
  db: DB;

  constructor(db: DB) {
    this.db = db;
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
    app.listen(4000);
  }
}

export default Server;
