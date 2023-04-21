const bcrypt = require('bcrypt');
const path = require('path');
const { unlink } = require('fs');
const People = require('../models/People');
// users page
const getUsers = async function (req, res, next) {
    try{
        const users = await People.find();
        res.render('users', {users: users});

    }catch (err){
        next(err);
    }
};

const addUser = async function(req, res, next){
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let newPeople; 

    if(req.files && req.files.length > 0){
        newPeople = new People({
            ...req.body, 
            avatar: req.files[0].filename, 
            password: hashedPassword
        });
    }else{
        newPeople = new People({
            ...req.body, 
            password: hashedPassword
        });
    }
    try {
      const newPeopleRes = await newPeople.save();
      res.status(200).json('User was saved successfully !');
    } catch (err) {
        res.status(500).json({
            errors:{
                common: {
                    msg: "Unknown error occured"
                }
            }
        });
    }
};

const removeUser = async function (req, res, next) {
    try {
        const user = await People.findByIdAndDelete({
          _id: req.params.id,
        });
    
        // remove user avatar if any
        if (user.avatar) {
          unlink(
            path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
            (err) => {
              if (err) console.log(err);
            }
          );
        }
    
        res.status(200).json({
          message: "User was removed successfully!",
        });
      } catch (err) {
        res.status(500).json({
          errors: {
            common: {
              msg: "Could not delete the user!",
            },
          },
        });
      }
};

module.exports = { getUsers, addUser, removeUser};
