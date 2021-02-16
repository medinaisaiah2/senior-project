const express = require("express");
const jwt = require("jsonwebtoken");
const {User} = require('./model/users');
const app = express();
const port = 8080;

//get post
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//mongoose
const mongoose = require('mongoose');
dburl = 'mongodb://localhost:27017/saprunner';
mongoose.connect(dburl);

//we might move this to router
app.post('/signup', function(req, res){
    var user =  new User({
        username = req.body.username,
        password = req.body.password
       
    });
    
    //save to db //could have also used user.save
    User.create(user, function(err,user){
        if(err){
            console.log("we have error when adding user");
            console.log(err);
        }
        else{
            return res.status(200).json({
                msg:"sucess"
            })
        }
    });
})

app.post('/login',function(req, res){
    username = req.body.username;
    password = req.body.password;
    if(username && password){//if not null
        User.authenticate(username, password,function(err, user){
            if(err || !user){
                console.log('error with username and password');
                return res.status(400).json({
                    msg: "invalid username password combination\ntry again"
                })
            }
            else{
                var payload = {
                    user: {
                        id: user.id
                }
                };
                jwt.sign(
                    payload,"randomString",{
                    expiresIn:3600
                },
                function(err, token){
                    if(err){
                       console.log(err);
                    }
                    res.status(200).json({
                        token
                    });
                }
                );
            }
        });
    }
})
//app.get("/", function(req, res){
//
//})

app.listen(port,function(){
    console.log(`Server listening on port ${port}`);
    
}
);