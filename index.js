const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
const app = express();

// dotenv.config();

// connect mongoose to mongodb database 
// mongoose.connect('mongodb://127.0.0.1/todos').then(()=>{
//     console.log("connection successful");
// }).catch((err)=>{
//     console.log(err.message);
// });


// routes 
// app.use('/user', userHandler);


// error handler middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    next('There was a problem !');
  } else {
    if (err.message) res.status(500).send(err.message);
    else res.status(500).send('there was an error !');
  }
});

// server listen on port 
app.listen(3000, () => {
  console.log(`listening on port 3000`);
});
