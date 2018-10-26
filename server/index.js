import express from 'express';
import log from 'fancy-log';
import router from './routes';
import { setupDbTables } from './utils/connection';

setupDbTables();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(router);

app.use((err, req, res, next) => {
  res.status(err.status);
  res.json({ message: err.message, status: false });
  next();
});

app.listen(port, () => {
  log('Server Started');
});

export default app;
