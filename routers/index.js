const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError404');

const userRouter = require('./users');
const cardRouter = require('./movies');
const signRouter = require('./sign');

router.use('/', signRouter);

router.use('/users', auth, userRouter);

router.use('/movies', auth, cardRouter);

router.use(() => {
  throw new NotFoundError({ message: 'Запрашиваемая страница не существует' });
});

module.exports = router;
