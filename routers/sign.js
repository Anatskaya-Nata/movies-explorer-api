const router = require('express').Router();

const {
  login,
  createUser,
} = require('../controllers/users');

const {
  validateSignInBody,
  validateSignUpBody,

} = require('../middlewares/validation');

router.post('/signin', validateSignInBody, login);
router.post('/signup', validateSignUpBody, createUser);

module.exports = router;
