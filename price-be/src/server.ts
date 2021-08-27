import express from 'express';

export const start = () => {
  const app = express();

  app.get('/api', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(4000);
};
