/* eslint-disable comma-dangle */
/* eslint-disable quotes */
const PORT_NUMBER = 3000;
const JWT_SECRET = "devSecret";
const MONGO_URL = "mongodb://localhost:27017/bitfilmsdb";

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};

const corsOptions = {
  origin: [
    "http://movies.diploma.nomoredomains.monster",
    "https://movies.diploma.nomoredomains.monster",
    "http://localhost:3000"
  ],
  credentials: true
};

module.exports = {
  PORT_NUMBER,
  JWT_SECRET,
  MONGO_URL,
  mongooseOptions,
  corsOptions
};
