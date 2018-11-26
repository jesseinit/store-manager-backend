import express from 'express';
import log from 'fancy-log';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import router from './routes';

const app = express();
const port = process.env.PORT || 3000;
const swaggerDoc = YAML.load(path.join(process.cwd(), './server/docs/docs.yaml'));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../ui/')));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
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
