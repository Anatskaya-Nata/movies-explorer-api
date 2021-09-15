const Movie = require('../models/movies');
const BadRequestError400 = require('../errors/BadRequestError400');
const ForbiddenError403 = require('../errors/ForbiddenError403');
const NotFoundError404 = require('../errors/NotFoundError404');

const getMovies = (req, res, next) => {
  Movie.find({})
    .populate('user')
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

const createMovies = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, thumbnail,
    nameRU, nameEN, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: req.user._id,
  })
    .then((movies) => res.send({ data: movies }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError400({ message: '111Переданы некорректные данные карточки' });
      } else {
        next(err);
      }
    })
    .catch(next);
};

const deleteMovies = (req, res, next) => {
  Movie.findById({ _id: req.params._id, owner: req.user._id })
    .orFail(() => new NotFoundError404({ message: 'Такая карточка не существует' }))
    .then((movies) => {
      if (!movies.owner.equals(req.user._id)) {
        throw new ForbiddenError403({ message: 'Вы не можете удалить чужую карточку' });
      } else {
        Movie.deleteOne(movies)
          .then(() => res.send({ message: 'успешо удалили карточку' }))
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovies,
  deleteMovies,
};
