const router = require('express').Router();

const {
  validateUserBody,

} = require('../middlewares/validation');

const {
  updateUser,
  receiveUser,
} = require('../controllers/users');

router.get('/me', receiveUser);

router.patch('/me', validateUserBody, updateUser);

module.exports = router;
