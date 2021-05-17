const express = require("express");
//using bcrypt package add on to encrypt user passwords 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//importing usrs model 
//const User = require("../models/userBots");
const router = express.Router();

router.get('/trades',checkauth,function(req, res, next){
    var trades = []
    //trades.push();
        //{trader1:{
        let data1 =[    
            {
                stock : "amzn",
                date : "2021-03-27T01:27:32",
                transaction : "buy",
                price : 3009.25,
                amount : 33,
                total_price : -99305.25
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:32",
                transaction : "sold",
                price : 3031.739990234375,
                amount : 33,
                total_price : 100047.41967773438
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:32",
                transaction : "buy",
                price : 2906.5,
                amount : 34,
                total_price : -98821
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:32",
                transaction : "sold",
                price : 3033.840087890625,
                amount : 34,
                total_price : 103150.56298828125
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:32",
                transaction : "buy",
                price : 2977.7900390625,
                amount : 35,
                total_price : -104222.6513671875
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:32",
                transaction : "sold",
                price : 3054.860107421875,
                amount : 35,
                total_price : 106920.10375976562
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:32",
                transaction : "buy",
                price : 3061.739990234375,
                amount : 35,
                total_price : -107160.89965820312
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:32",
                transaction : "sold",
                price : 3018.530029296875,
                amount : 35,
                total_price : 105648.55102539062
            },
            {
            stock : "amzn",
            date : "2021-03-27T01:27:32",
            transaction : "buy",
            price : 3095.02001953125,
            amount : 34,
            total_price : -105230.6806640625
            },
            {
            stock : "amzn",
            date : "2021-03-27T01:27:32",
            transaction : "sold",
            price : 3061.780029296875,
            amount : 34,
            total_price : 104100.52099609375
            },
            {
            stock : "amzn",
            date : "2021-03-27T01:27:32",
            transaction : "buy",
            price : 3093.199951171875,
            amount: 33,
            total_price : -102075.59838867188
            },
            {
            stock : "amzn",
            date : "2021-03-27T01:27:32",
            transaction : "sold",
            price : 3183.5400390625,
            amount : 33,
            total_price : 105056.8212890625
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:33",
                transaction : "buy",
                price : 3120,
                amount : 34,
                total_price : -106080
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:33",
                transaction: "sold",
                price : 3128.43994140625,
                amount : 34,
                total_price : 106366.9580078125
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:33",
                transaction : "buy",
                price : 3123.02001953125,
                amount : 34,
                total_price : -106182.6806640625
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:33",
                transaction : "sold",
                price : 3107,
                amount : 34,
                total_price : 105638
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:33",
                transaction : "buy",
                price : 3127.030029296875,
                amount : 34,
                total_price : -106319.02099609375
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:33",
                transaction : "sold",
                price : 3166.75,
                amount : 34,
                total_price : 107669.5
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:33",
                transaction : "buy",
                price : 3136.739990234375,
                amount : 34,
                total_price : -106649.15966796875
            },
            {
                stock : "amzn",
                date : "2021-03-27T01:27:33",
                transaction : "sold",
                price : 3095.199951171875,
                amount : 34,
                total_price : 105236.79833984375
            }
    ]
    // let data2 = [
    //     {
    //         stock : "tsla",
    //         date : "2021-03-27T01:27:01",
    //         transaction : "buy",
    //         price : 406.8999938964844,
    //         amount : 245,
    //         total_price : -99690.49850463867
    //     },
    //     {
    //         stoc : "tsla",
    //         dat : "2021-03-27T01:27:01",
    //         transactio : "sold",
    //         price : 394,
    //         amount : 245,
    //         total_pric : 96530
    //     },
    //     {
    //         stoc : "tsla",
    //         date : "2021-03-27T01:27:01",
    //         transactio: "buy",
    //         price : 408.92999267578125,
    //         amoun : 236,
    //         total_price : -96507.47827148438
    //     },
    //     {
    //         stock : "tsla",
    //         date : "2021-03-27T01:27:01",
    //         transaction : "sold",
    //         price : 574.3699951171875,
    //         amount : 236,
    //         total_price : 135551.31884765625
    //     },
    //     {
    //         stock : "tsla",
    //         date : "2021-03-27T01:27:02",
    //         transaction : "buy",
    //         price : 779.0900268554688,
    //         amount : 174,
    //         total_price : -135561.664675156
    //     },
    //     {
    //         stock : "tsla",
    //         date : "2021-03-27T01:27:02",
    //         transaction : "sold",
    //         price : 780.9000244140625,
    //         amount : 174,
    //         total_price : 135876.60424804688
    //     },
    //     {
    //         stock : "tsla",
    //         date : "2021-03-27T01:27:02",
    //         transaction : "buy",
    //         price : 795,
    //         amount : 171,
    //         total_price : -135945
    //     },
    //     {
    //         stock : "tsla",
    //         date : "2021-03-27T01:27:02",
    //         transaction : "sold",
    //         price : 762.6400146484375,
    //         amount : 171,
    //         total_price : 130411.44250488281
    //     },
    //     {
    //         stock : "tsla",
    //         date : "2021-03-27T01:27:02",
    //         transaction : "buy",
    //         price : 662.1300048828125,
    //         amount : 197,
    //         total_price : -130439.61096191406
    //     },
    //     {
    //         stock : "tsla",
    //         date : "2021-03-27T01:27:02",
    //         transaction : "sold",
    //         price : 711.8499755859375,
    //         amount : 197,
    //         total_price : 140234.4451904297
    //     },
    //     {
    //         stock : "tsla",
    //         date : "2021-03-27T01:27:02",
    //         transaction : "buy",
    //         price : 726.1500244140625,
    //         amount : 193,
    //         total_price : -140146.95471191406
    //     },
    //     {
    //         stock : "tsla",
    //         date : "2021-03-27T01:27:02",
    //         transaction : "sold",
    //         price : 700,
    //         amount : 193,
    //         total_price : 135100
    //     },
    //     {
    //         stock : "tsla",
    //         date : "2021-03-27T01:27:02",
    //         transaction : "buy",
    //         price : 690.1099853515625,
    //         amount : 196,
    //         total_price : -135261.55712890625
    //     },
    //     {
    //         stock : "tsla",
    //         date : "2021-03-27T01:27:02",
    //         transaction : "sold",
    //         price : 718.280029296875,
    //         amount : 196,
    //         total_price : 140782.8857421875
    //     }
    // ]
    trades.push(data1);
    //});
   // trades.push(data2);
    let username = res.locals.username;//get username
    //if(username == null){
    //    return res.status(200).json({
    //        msg: 'invalid token OR username not found'
    //    });
    //}
    if(true){//if no problems with the token then continue
        //return res.json({msg:trades});
        return res.json(data1);

    }
});

//should it's own route but in for testing purpose this is okay
function checkauth(req, res, next){
    //normally username would be null until the token is verified but that will be ignored
    var username = "username";
    return next();
    //checking my values will need to delete 
    //console.log(req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    try{
        const decoded = jwt.verify(token, "randomString");
        username = decoded.username;
    } catch(e){
        console.log(e);
    }
    res.locals.user = username;
    next();
}


module.exports = router; 