const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rootRouter = require('./routers');
const {
  PORT_NUMBER,
  MONGO_URL,
  mongooseOptions,
  corsOptions,
} = require('./config/constants/constants');

const { PORT = PORT_NUMBER } = process.env;

const app = express();
mongoose.connect(MONGO_URL, mongooseOptions);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);
app.use('/', rootRouter);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { status = 500, message } = err;

  res
    .status(status)
    .send({
      message: status === 500
        ? 'На сервере произошла ошибка'
        : message.message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
