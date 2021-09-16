const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const {
  login,
  createUser,
} = require('./controllers/users');

const {
  validateSignInBody,
  validateSignUpBody,

} = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

const rootRouter = require('./routers');

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateSignInBody, login);

app.post('/signup', validateSignUpBody, createUser);
app.use(auth);
app.use('/', rootRouter);

const corsOptions = {
  origin: [
    'http://movies.diploma.nomoredomains.monster',
    'https://movies.diploma.nomoredomains.monster',
    'http://localhost:3001',
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(errorLogger);

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

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
