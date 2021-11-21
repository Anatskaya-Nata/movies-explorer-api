import express, { json } from 'express';
import { connect } from 'mongoose';
import { errors } from 'celebrate';
import cors from 'cors';
import { requestLogger, errorLogger } from './middlewares/logger';
import rootRouter from './routers';
import {
  PORT_NUMBER,
  MONGO_URL,
  mongooseOptions,
  corsOptions,
} from './config/constants/constants';

require('dotenv').config();

const { PORT = PORT_NUMBER } = process.env;
// const { PORT = 3001 } = process.env;

const app = express();
connect(MONGO_URL, mongooseOptions);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(cors(corsOptions));
app.use(json());
app.use(requestLogger);
app.use('/', rootRouter);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { status = 500, message } = err;

  res.status(status).send({
    message: status === 500 ? 'На сервере произошла ошибка' : message.message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
