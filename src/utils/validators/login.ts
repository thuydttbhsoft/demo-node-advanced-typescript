const Joi = require('joi');

const LoginValidate = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};
export default LoginValidate;
