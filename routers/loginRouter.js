// external imports
const express = require('express');

// internal imports
const { getLogin, login, logout } = require('../controllers/loginController');
const { decorateHtmlResponse } = require('../middlewares/common/decorateHtmlResponse');
const { doLoginValidators, doLoginValidationHandler } = require('../middlewares/login/loginValidators');
const { redirectLoggedIn } = require('../middlewares/common/checkLogin');
const router = express.Router();

// login page
router.get('/', decorateHtmlResponse('Login'), redirectLoggedIn, getLogin);

// do login
router.post('/', decorateHtmlResponse('Login'), doLoginValidators, doLoginValidationHandler, login);

// do logout
router.delete('/', logout);

module.exports = router;
