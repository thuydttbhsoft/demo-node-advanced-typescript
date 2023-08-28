const Joi = require('joi');

const UserValidate = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

export default UserValidate;
