const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.pattern.base": `"phone" must contain only numbers`,
      "any.required": `"phone" is a required field`,
    }),
});

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .messages({
      "string.pattern.base": `"phone" must contain only numbers`,
    }),
}).or("name", "email", "phone");

module.exports = {
  addContactSchema,
  updateContactSchema,
};
