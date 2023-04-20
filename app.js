// external imports
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

// internal imports
const { notFoundHandler, errorHandler } = require('./middlewares/common/errorHandler');
const loginRouter = require('./routers/loginRouter');
const usersRouter = require('./routers/usersRouter');
const inboxRouter = require('./routers/inboxRouter');

// create the app object
const app = express();

// .env configs
dotenv.config();

// databse connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log('databse connected');
  })
  .catch(err => {
    console.log(err.message);
  });

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// set cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/inbox', inboxRouter);


// error handling
// 404 not found handler
app.use(notFoundHandler);

// default error handler 
app.use(errorHandler);


// start server
app.listen(process.env.PORT, () => {
  console.log(`App listening to port ${process.env.PORT}`);
});
