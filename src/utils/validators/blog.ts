const Joi = require("joi");

const BlogValidate = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

// module.exports = {
//     UserValidate,
// };
export default BlogValidate

// export type User = Joi.extractType<typeof user>;