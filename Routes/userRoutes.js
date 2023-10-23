const express = require('express');
const router = express.Router();
const { registerUser, login, dashboard } = require('../Controllers/userController');
const { validateRequest, validateLogin } = require('../utils/common');
const {validateRegistration,validateLoginCred} = require('../utils/validate');
const { isAuthenticated } = require('../utils/middleware');

router.post('/registration', validateRequest(validateRegistration), isAuthenticated, registerUser);
router.post('/login', validateLogin(validateLoginCred), login);

router.get('/dashboard', isAuthenticated, dashboard);

module.exports = router ;