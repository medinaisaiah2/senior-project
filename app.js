//var exec = require("child_process");
const spawn = require("child_process").spawn;
const { text } = require("express");
const express = require("express");

const app = express()
const port = 8080

app.get("/",function(req, res){
    res.send("home page");
}
);

app.get("/trade",function(req, res){
    var contain_spaces = false;
    var stk = req.query.stk;
    var strat = req.query.strat;
    strat = strat.concat(".py");
    if(strat == contain_spaces){
        //if it has spaces or other bad metacharactes return 
        console.log("contains spaces");
        res.redirect("/");//redirect to home for now but that will change
    }
    //var myscript = __dirname + "/trial1/";
    //myscript = myscript.concat(strat);
    //strat.concat(stk);
    //exec()
    //console.log(myscript);
    var mycmd = spawn('python3', [__dirname + "/trial1/" + strat,stk], {
      detached: true,
      shell: true
    });
    mycmd.unref();
    //error checking
    // mycmd.stdout.on('data',function(data){
    //     console.log("on stdout");
    //     console.log(data);
    // })
    // mycmd.stderr.on('data',function(data){
    //     console.log("on stderr");
    //     console.log(data);
    //     console.log("error given");
    //     var textout = data.toString('utf8');
    //     console.log(textout);
    // });
    // mycmd.on('close',function(data){
    //     console.log(data);
    // });
    //console.log(myscript);
    console.log(stk);
    //console.log(doprocess);
    res.redirect("/");
});

app.get("/test",function(req, res){
    var mycmd = spawn('which', ['python3'],{

    });
    mycmd.stdout.on('data',function(data){
        console.log("on stdout");
        console.log(data);
        var textout = data.toString('utf8');
        console.log(textout);
    })
    mycmd.stderr.on('data',function(data){
        console.log("on stderr");
        console.log(data);
    });
    mycmd.on('close',function(data){
        console.log(data);
    });
    mycmd.on('exit',function(data){
        console.log(data);
    });
    res.redirect("/");
});

app.listen(port,function(){
    console.log(`Server listening on port ${port}`)
}
);

///python = spawn(‘python’, [‘script2.py’,’node.js’,’python]);
