const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError404');

const userRouter = require('./users');
const cardRouter = require('./movies');

router.use('/users', userRouter);

router.use('/movies', cardRouter);

router.use(() => {
  throw new NotFoundError({ message: 'Запрашиваемая страница не существует' });
});

module.exports = router;
