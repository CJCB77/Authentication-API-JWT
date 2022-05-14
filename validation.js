//Validation 
const Joi = require('joi');

//Register validation
const registerValidation = (data) => {
  const userSchema = Joi.object({
    username: Joi.string().required().min(4).max(20),
    password: Joi.string().required().min(8).max(16),
    email: Joi.string().required().email()
  
  });
  return userSchema.validate(data);
  
}

//Login validation
const loginValidation = (data) => {
  const loginSchema = Joi.object({
    username: Joi.string().required().min(4).max(20),
    password: Joi.string().required().min(8).max(16)
  });
  return loginSchema.validate(data);
}



module.exports = {
  registerValidation,
  loginValidation
}