const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateUserRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    number: Joi.number(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};
const validateUserLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = { validateUserRegister, validateUserLogin };
