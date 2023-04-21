// external imports
const createError = require('http-errors');
const { unlink } = require('fs');
const path = require('path');

// internal imports
const { check, validationResult } = require('express-validator');
const User = require('../../models/People');

const addUserValidator = [
  check('name')
    .isLength({ min: 1 })
    .withMessage('Name is required')
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Name must not contain anything other than alphabet')
    .trim(),
  check('email')
    .isEmail()
    .withMessage('Invalid email address')
    .trim()
    .custom(async value => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError('Email is already in use');
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check('mobile')
    .isMobilePhone('bn-BD', { strictMode: true })
    .withMessage('Mobile number must be a valid Bangladeshi mobile number')
    .custom(async value => {
      try {
        const user = await User.findOne({ mobile: value });
        if (user) {
          throw createError('Mobile is already in use');
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check('password')
    .isStrongPassword()
    .withMessage('Password must be 8 characters long'),

];

const addUserValidationHandler = function (req, res, next){
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if(Object.keys(mappedErrors).length === 0){
        next()
    }else{
        if(req.files.length > 0){
            const { fileName } = req.files[0]; 
            unlink(path.join(__dirname, `/../public/uploads/avatars/${fileName}`), (err)=>{
                if(err)
                    console.log(err);
            });
        }
        res.status(500).json({errors: mappedErrors});
    }
};

module.exports = {
    addUserValidator, 
    addUserValidationHandler
};