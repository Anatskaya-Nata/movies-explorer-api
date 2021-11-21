const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/users');
const BadRequestError400 = require('../errors/BadRequestError400');
const NotFoundError404 = require('../errors/NotFoundError404');
const AccessError401 = require('../errors/AccessError401');
const ConflictAccess409 = require('../errors/ConflictAccess409');

const receiveUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError404({ message: 'Пользователь с такими данными не зарегестрирован' }))
    .then((user) => res.send({ data: user }))
    // .then((user) => res.send({ user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictAccess409({ message: 'Пользователь с такими данными уже существует' });
      } else {
        return bcrypt.hash(password, 10)
          .then((hash) => {
            User.create({
              name,
              email,
              password: hash,
            })
              .then(() => res.send(
                {
                  name, email,
                },

              ))
              .catch((err) => {
                if (err.name === 'ValidationError') {
                  next(new BadRequestError400({ message: 'Переданы некорректные данные пользователя' }));
                } else if (err.code === 11000) {
                  next(new ConflictAccess409({ message: 'Пользователь с такими данными уже существует' }));
                } else {
                  next(err);
                }
              })
              .catch(next);
          });
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const {
    email, password,
  } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AccessError401({ message: 'Неправильный логин или пароль' });
      } else {
        bcrypt.compare(password, user.password, ((error, isValid) => {
          if (error) {
            next(new AccessError401({ message: 'Неправильный логин или пароль' }));
          }

          if (!isValid) {
            next(new AccessError401({ message: 'Неправильный логин или пароль' }));
          } else {
            const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
            res
              .status(200)
              .send({
                token,
              });
          }
        }));
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new NotFoundError404({ message: 'Пользователь с такими данными не зарегестрирован' }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError400({ message: 'Переданы некорректные данные пользователя' }));
      } else {
        next(new ConflictAccess409({ message: 'Пользователь с такими данными уже существует' }));
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateUser,
  login,
  receiveUser,
};
