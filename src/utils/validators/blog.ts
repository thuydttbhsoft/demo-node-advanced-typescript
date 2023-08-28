const Joi = require('joi');

const BlogValidate = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

export default BlogValidate;
