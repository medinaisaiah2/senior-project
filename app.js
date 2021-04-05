//some global stuff
let randomstring = "somesuperrandomstringforjwt";

//express imports
const express = require("express");
const jwt = require("jsonwebtoken");
const {User} = require('./model/user');
const app = express();
const port = 8080;

//to be able to spawn child process
const spawn = require("child_process").spawn;

//get post
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//mongoose
var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
dburl = 'mongodb://localhost:27017/saprunner';
mongoose.connect(dburl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.listen(port,function(){
    console.log(`Server listening on port ${port}`);
    
});

//we might move this to router
app.post('/signup', function(req, res){
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
                        id: user.id,
                        username: user.username
                }
                };
                jwt.sign(
                    payload,randomstring,{
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


app.get('/userscripts', checkauth, async function(req, res){
    //let scriptnames = ['traderaNanLXYCcGB89','traderaNdbKRWEcFU8'];
    let username = res.locals.user.username;
    //console.log(username);
    let query = ({'username':username});
    let scriptnames = await findbyusername('userscripts','saprunner',query);
    console.log(scriptnames);
    console.log(scriptnames.length);
    dbname = "saprunner";
    //build the functions
    var torun = []
    for(i = 0; i < scriptnames.length; i++){
        torun.push(getallfromdoc(scriptnames[i]['script'], dbname));
        console.log(scriptnames[i]['script']);
    }
    results = 'none';
    var results = await Promise.all(torun);
    //console.log(results[0]);
    //console.log(results[1])
    data = [];
    for(i = 0; i < results.length; i++){
        data.push(results[i][0]);
    }
    //response.push(results[0][0]);
    //response.push(results[1][0]);
    //console.log(response);
    //res.redirect('/index');
    return res.json(data);//as per Diego changed from msg:result to just result
})

function getallfromdoc(collection, dbname){//dbname is almost always saprunner
    return new Promise(function(resolve, reject){
        MongoClient.connect(dburl, function(err, client){
            var dbo = client.db(dbname);
            //dbo.collection(collection).find({},{projection:{"_id":false}}).toArray(function(err, docs){
                dbo.collection(collection).find({},{projection:{"_id":false}}).sort({"_id":-1}).limit(1).toArray(function(err, docs){
                if(err){
                    return reject(err);
                }
                return resolve(docs);
            });//don't include the id
            //console.log(res);
            //resolve(res);
        });
    })
    
}

function findbyusername(collection, dbname, query){
    return new Promise(function(resolve, reject){
        MongoClient.connect(dburl, function(err, client){
            var dbo = client.db(dbname);
            dbo.collection(collection).find(query,{projection:{"_id": false, "script":1}}).toArray(function(err, res){
                if(err){
                    return reject(err);
                }
                return resolve(res);
            })
        })
    })
}

app.get('/api/runtest',async function(req, res){
    file2run = hello.py
    token = req.query.token;//currently using a token in url get
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
        // var mycmd = spawn('python3', [__dirname + "/trial1/" + strat,__dirname + "/trial1/"+stk], {// <- this is necessary for detaching the child
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

async function verifytoken(token){//this function is to verify a token that is in a part of get request with no header
    var user;
    try{
        const decode = jwt.verify(token, randomstring);
        user = decoded.user;
    } catch(e){
        console.log(e);
    }
    return user;
}

function checkauth(req, res, next){//this uses the header authorization
    var user;
    //checking my values will need to delete 
    //console.log(req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    try{
        const decoded = jwt.verify(token, randomstring);
        user = decoded.user;
    } catch(e){
        console.log(e);
    }
    res.locals.user = user;
    next();
}

//test
app.use(express.static('dist/trader'));