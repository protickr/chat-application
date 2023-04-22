const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const People = require('../models/People');

// login page
const getLogin = function (req, res, next) {
  res.render('index');
};

// do login
const login = async function (req, res, next) {
  try {
    // find an user from People where user's email or phone matches
    const user = await People.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });

    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        const userObj = {
          username: user.name,
          mobile: user.mobile,
          email: user.email,
          role: 'user',
        };

        const token = jwt.sign(userObj, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });
        // set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
        });

        res.locals.loggedInUser = userObj;
        res.render('inbox');
      } else {
        throw createError('login failed, please try again');
      }
    } else {
      throw createError('login failed, please try again');
    }
  } catch (err) {
    res.render('index', {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

const logout = function (req, res, next){
    res.clearCookie(process.env.COOKIE_NAME);
    res.send('logged out');
};

module.exports = { getLogin, login, logout };
