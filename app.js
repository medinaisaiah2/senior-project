const express = require("express");
const jwt = require("jsonwebtoken");
const {User} = require('./model/user');
const app = express();
const port = 8080;

//to be able to spawn 
const spawn = require("child_process").spawn;

//get post
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//mongoose
const mongoose = require('mongoose');
dburl = 'mongodb://localhost:27017/saprunner';
mongoose.connect(dburl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.listen(port,function(){
    console.log(`Server listening on port ${port}`);
    
});

//development purposes DOT NOT go into produciton with this settings
app.use(function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');//possible need Content-Type
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

//we might move this to router
app.post('/signup', function(req, res){
    console.log(req);
    var user =  new User({
        username : req.body.username,
        password : req.body.password
       
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
    console.log(req);
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
                        userid: user.id,
                        username: user.username,
                }
                };
                jwt.sign(
                    //randomstring should not be in code. maybe make it environment variable
                    payload,"randomString",{
                    expiresIn:"1h"
                },
                function(err, token){
                    if(err){
                       console.log(err);
                       return res.status(401).json({
                           msg:"Auth failed"
                       })
                    }
                    //expires must be in seconds
                    res.status(200).json({
                        userid: user.id,
                        username: user.username,
                        expiresIn:3600,
                        token: token
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

app.get('/api/runtest',async function(req, res){
    file2run = "/recommender-yfinance.py";
    token = req.query.token;
    try{
        var user = await verifytoken(token);
    }catch(e){
        res.send.json({msg:'error in token'});
    }
    if(user){
        //peform some op
    }
    else{
        var bigdata = [];
        var python = spawn('python3', [__dirname + file2run]);
        python.stdout.on('data', function(data){
            bigdata.push(data);
        })
        python.stderr.on('data',function(data){
            console.log("on stderr");
            console.log(data);
            console.log("error given");
            var textout = data.toString('utf8');
            console.log(textout);
        });
        python.on('close', function(exitcode){
            console.log(`process ended with code ${exitcode}`);
            //toreturn = bigdata.join("")
            res.json({msg: toreturn = bigdata.join("")})
        })
        // var mycmd = spawn('python3', [__dirname + "/trial1/" + strat,__dirname + "/trial1/"+stk], {
        //     //detached: true,
        //     //shell: true
        //   });
        //   //mycmd.unref();
        //   //error checking
        //   mycmd.stdout.on('data',function(data){
        //       console.log("on stdout");
        //       console.log(data);
        //   })
        //   mycmd.stderr.on('data',function(data){
        //       console.log("on stderr");
        //       console.log(data);
        //       console.log("error given");
        //       var textout = data.toString('utf8');
        //       console.log(textout);
        //   });
        //   mycmd.on('close',function(data){
        //       console.log(data);
        //   });
    }
}) 

async function verifytoken(token){
    var user;
    try{
        const decode = jwt.verify(token, "randomstring");
        user = decoded.user;
    } catch(e){
        console.log(e);
    }
    return user;
}

//test
app.use(express.static('test'));