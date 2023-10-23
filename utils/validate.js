const Joi = require('joi');

const validateRegistration = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string()
        .length(10)
        .pattern(/[6-9]{1}[0-9]{9}/)
        .required(),
    password: Joi.string(),
    confirmPassword: Joi.ref("password")
})

const validateLoginCred = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string(),
})


module.exports = { validateRegistration, validateLoginCred };

