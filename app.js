//some global stuff
let randomstring = "somesuperrandomstringforjwt";

//express imports
const express = require("express");
const jwt = require("jsonwebtoken");
const {User} = require('./model/user');
const app = express();
const port = 8080;

//requires for files
const csvtojson = require("csvtojson");
const fs = require('fs');
const path = require('path');

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
    var username = res.locals.user.username;
    //console.log(res.locals.user);
    //console.log(username);
    let query = ({'username':username});
    //console.log(query);
    let scriptnames = await findbyusername('userscripts','saprunner',query);
    //console.log(scriptnames);
    //console.log(scriptnames.length);
    dbname = "saprunner";
    //build the functions
    var torun = []
    for(i = 0; i < scriptnames.length; i++){
        torun.push(getallfromdoc(scriptnames[i]['script'], dbname));
        //console.log(scriptnames[i]['script']);
    }
    results = 'none';
    var results = await Promise.all(torun);
    //console.log(results[0]);
    //console.log(results[1])
    data = [];
    for(i = 0; i < results.length; i++){
        data.push(results[i]);
    }
    //response.push(results[0][0]);
    //response.push(results[1][0]);
    //console.log(response);
    //res.redirect('/index');
    return res.json(data);//as per Diego changed from msg:result to just result
})

function insertuserscript(collection, dbname, username, scriptname){
    return new Promise(function(resolve, reject){
        //prepare to insert
        let values = {"username":username, "script":scriptname, "status":1};
        MongoClient.connect(dburl, function(err, client){
            var dbo = client.db(dbname);
            if(!dbo){
                let rejected = "failed to connect";
                return reject(rejected);
            }
            dbo.collection(collection).insertOne(values, function(err, response){
                if(err){
                    return resolve(err);
                }
                else{
                    return resolve(true);
                }
            })
            
        });
    });
}

function getallfromdoc(collection, dbname){//dbname is almost always saprunner
    return new Promise(function(resolve, reject){
        MongoClient.connect(dburl, function(err, client){
            var dbo = client.db(dbname);
            dbo.collection(collection).find({},{projection:{"_id":false}}).toArray(function(err, docs){
                //dbo.collection(collection).find({},{projection:{"_id":false}}).sort({"_id":-1}).limit(1).toArray(function(err, docs){
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

//app.get('/api/runtest', checkauth, async function(req, res){
//app.get('/api/runstrategy', checkauth, async function(req, res){
//    app.get('/api/runstrategy', async function(req, res){
app.post('/api/runstrategy', checkauth, async function(req, res){
    if(!res.locals.user){
        return res.json({msg:'error in token'});
    }
    else{
        var username = res.locals.user.username;
        var strategy = req.body.strategy;
        var ticker = req.body.ticker;
        var moneyallocation = req.body.moneyallocation;
        var bbacktest = req.body.backtest;
        var backtest = 'false';
        if(bbacktest == true){//should be a string | this is just to be sure
            backtest = 'true';
        }
        //test
        /*
        console.log(req.body.strategy);
        console.log(req.body.ticker);
        console.log(req.body.moneyallocation);
        console.log(req.body.backtest);
        var bbacktest = req.body.backtest;
        if(bbacktest == false){
            console.log("it is false");
        }
        if(bbacktest == true){
            console.log("it is true");
        }
        return res.status(200).json("success");
        */
        if(!strategy){
            strategy = 'std';
        }
        var frontendstrategies = ['std','RSI','MACD','Support-resistance'];
        var maptobackend = ['trade_std','trade_rsi','trade_macd','trade_sr'];
        let indexofstrategy = frontendstrategies.indexOf(strategy);
        if(indexofstrategy < 0){
            strategy = 'trade_std';
        }
        else{
            strategy = maptobackend[indexofstrategy];
        }
        //strategy = 'trade_std';
        strategy = strategy + '.py';
        if(strategy && ticker && moneyallocation){
            res.status(200).json({mgs:'success'});
        }
        else{
            res.status(200).json({mgs:'something went wrong'});
        }
        //console.log(strategy);
        let uniquecolname = await makeuniquecoll();
        let result = await insertuserscript("userscripts","saprunner",username, uniquecolname);
        //console.log(uniquecolname);
        var mycmd = spawn('python3', [__dirname + "/scripts/" + strategy, ticker, uniquecolname, moneyallocation, backtest], {// <- this is necessary for detaching the child
            detached: true,
            shell: true
          });
        mycmd.unref();
        //error checking
        mycmd.stdout.on('data',function(data){
            //console.log"on stdout");
            //console.log(data);
        })
        mycmd.stderr.on('data',function(data){
            //console.log("on stderr");
            //console.log(data);
            //console.log("error given");
            //var textout = data.toString('utf8');
            //console.log(textout);
        });
        mycmd.on('close',function(data){
            console.log(data);
        });
    }
}); 

app.get('/api/history', async function(req, res){
    let ticker = req.query.ticker;
    ticker = ticker.toUpperCase();
    //console.log(ticker);
    let datapath = '/data/';
    var csvdatapath = __dirname + datapath + ticker + '_data.csv';
    //access uses a callback
    fs.access(csvdatapath, fs.constants.F_OK, function(err){
        if(err){
            //console.log(err);
            csvdatapath = __dirname + datapath + "AAPL" + '_data.csv';
        }
        csvtojson().fromFile(csvdatapath)
        .then(function(json){
            return res.status(200).json(json);
        });
    });
});

app.get('/api/get/recommendations', async function(req, res){
    var csvdatapath = __dirname + '/recommendations.csv';
    //access uses a callback
    fs.access(csvdatapath, fs.constants.F_OK, function(err){
        if(err){
            console.log(err);
        }
        csvtojson().fromFile(csvdatapath)
        .then(function(json){
            return res.status(200).json(json);
        });
    });
});

app.get('/api/data/tickerlist', async function(req, res){
    var bigdata = [];
    const data_dir = path.join(__dirname + '/data'); 
    fs.readdir(data_dir, function(err, files){
        if(err){
            console.log('error ocurred');
            return res.status(200).json({msg:'not authorized to make this request'});
        }
        //read the data and send it as json
        if(files){
            //build the data to send
            files.forEach(function(file){
                if(file.includes('_data.csv')){
                    var n = file.indexOf('_data');
                    var filestr = file.substr(0,n);
                    bigdata.push(filestr);
                }
            });
            return res.status(200).json(bigdata);
        }
        else{
            return res.status(200).json({msg:'not authorized to make this request'});
        }
    })
});

async function verifytoken(token){//this function is to verify a token that is in a part of get request with no header
    var user;
    try{
        const decode = jwt.verify(token, randomstring);
        user = decoded.user;
    } catch(e){
        console.log(e);
        return res.json({msg:"error in token"});
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
    //console.log("inside checkauth")
    //console.log(user);
    res.locals.user = user;
    next();
}

//make a new unique name for collection
//needs to be async because it calls getcollections which returns a promise and it must wait for it before proceeding
//https://stackoverflow.com/questions/30470415/listing-all-collections-in-a-mongo-database-within-a-nodejs-script
async function makeuniquecoll(){
    const length = 12;
    var myunique = '';
    var haveunique = false;
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charlength = characters.length;
    //var currentcollections = await exports.getcollections();
    var currentcollections = await getcollections();
    console.log("current in collections");
    console.log(currentcollections);
    // var collectionlist = [];
    // for(var i = 0; i < currentcollections.length; i++){
    //     collectionlist.push(currentcollections[i]['name']);
    // }
    //console.log(collectionlist);
    do{
    for(var i = 0; i < length; i++){
        myunique += characters.charAt(Math.floor(Math.random() * charlength));
    }
    //check
    // if(currentcollections.indexOf("trader")){
    //     console.log("check check : trader exists");
    // }
    //
    if(currentcollections.indexOf("trader" + myunique)){
        haveunique = true;
    }
    }while(!haveunique);
    myunique = "trader" + myunique;
    //console.log(myunique);
    return myunique;
}

//get list of collections
function getcollections() {
    return new Promise(function(res,rej){
        MongoClient.connect("mongodb://localhost:27017",function(err, client){
            //var dbo = client.db(dbname);
            var dbo = client.db("saprunner");
            dbo.listCollections({},{nameOnly:true}).toArray(function (err, collectionInfo){
                console.log(collectionInfo);
                res(collectionInfo);
            });
            
    })
    });
}

//log python 
console.logpython = function(data){
    fs.writeFile('mypython.log', data, 'utf8');
}

//server frontend
app.use(express.static('dist/trader/'));
app.get("/*",function(req, res){
    res.redirect("/index.html");
})