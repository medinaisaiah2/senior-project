const express = require("express");
//using bcrypt package add on to encrypt user passwords 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//importing usrs model 
const User = require("../models/user");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  console.log(req);
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req,res,next) =>{
    let fetchedUser;
    //checking to see if theres a user with those provided credentials 
    User.findOne({email: req.body.email})
    .then( user => {
        console.log(user);
        if (!user){
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        console.log(result);
        if(!result) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, "this_is_the_secret_code_used", {expiresIn: "1h"});
        //returning tocken 
        res.status(200).json({
            token: token
        });
    })
    .catch(err =>{
        return res.status(401).json({
            message: "Auth failed"
        });
    });
});

module.exports = router; 
