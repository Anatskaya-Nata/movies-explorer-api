const { celebrate, Joi } = require('celebrate');

const regex = /(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(\w{2,})))((\/.+)+)?\/?#?/;

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().min(2)
      .pattern(regex),
    trailer: Joi.string().required().min(2)
      .pattern(regex),
    thumbnail: Joi.string().required().min(2)
      .pattern(regex),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
});

const validateIdParams = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

const validateSignInBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignUpBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  validateUserBody,
  validateMovieBody,
  validateIdParams,
  validateSignInBody,
  validateSignUpBody,
};
