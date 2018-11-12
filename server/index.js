import express from 'express';
import log from 'fancy-log';
import cors from 'cors';
import path from 'path';
import router from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/ui', express.static(path.join(__dirname, '../ui/')));
app.use(router);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ message: err.message, status: 'failure' });
  next();
});

app.listen(port, () => {
  log('Server Started');
});

export default app;
