// external imports
const express = require('express');

// internal imports
const { getUsers, addUser, removeUser } = require('../controllers/usersController');
const { decorateHtmlResponse } = require('../middlewares/common/decorateHtmlResponse');
const avatarUpload = require('../middlewares/users/avatarUpload');
const { addUserValidator, addUserValidationHandler } = require('../middlewares/users/userValidators');

const router = express.Router();

// users page
router.get('/', decorateHtmlResponse('Users'), getUsers);
router.post('/',  avatarUpload, addUserValidator, addUserValidationHandler, addUser);
router.delete('/:id', removeUser);

module.exports = router;
