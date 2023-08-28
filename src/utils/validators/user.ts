const Joi = require("joi");

const UserValidate = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

// module.exports = {
//     UserValidate,
// };
export default UserValidate

// export type User = Joi.extractType<typeof user>;