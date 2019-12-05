import Joi from '@hapi/joi';

const name = Joi.string()
  .min(6)
  .required();
const email = Joi.string()
  .min(6)
  .required()
  .email();
const password = Joi.string()
  .min(6)
  .required();

function signUpValidation(data) {
  const schema = Joi.object({
    name,
    email,
    password
  });
  return schema.validate(data);
}

function signInValidation(data) {
  const schema = Joi.object({
    email,
    password
  });
  return schema.validate(data);
}
export { signUpValidation, signInValidation };
