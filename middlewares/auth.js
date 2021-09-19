const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const AccessError401 = require('../errors/AccessError401');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  // console.log('authorization', authorization);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AccessError401({ message: 'Необходима авторизация' });
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // верифицируем токен
    // payload = jwt.verify(token, 'JWT_SECRET');
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    throw (new AccessError401({ message: 'Авторизация не прошла' }));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};

module.exports = auth;
