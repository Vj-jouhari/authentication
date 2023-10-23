const { validateRegistration, validateLoginCred } = require('../utils/validate');

exports.validateRequest = (schema) => {
    return (req, res, next) => {
        const result = validateRegistration.validate(req.body, { abortEarly: false });
        if (result.error) {
            return res.status(400).json(result.error.details);
        }
        next();
    }
};

exports.validateLogin = (schema) => {
    return (req, res, next) => {
        const result = validateLoginCred.validate(req.body, { abortEarly: false });
        if (result.error) {
            return res.status(400).json(result.error.details);
        }
        next();
    }
};