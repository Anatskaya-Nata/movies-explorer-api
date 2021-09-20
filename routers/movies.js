const router = require('express').Router();

const {
  getMovies,
  createMovies,
  deleteMovies,

} = require('../controllers/movies');

const {
  validateMovieBody,
  validateIdParams,

} = require('../middlewares/validation');

router.get('/', getMovies);

router.post('/', validateMovieBody, createMovies);

router.delete('/:_id', validateIdParams, deleteMovies);

module.exports = router;
