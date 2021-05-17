const path = require("path"); 
//will hold express app 
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const Transactions = require('./models/transactions'); 


// importing user routes 
const userRoutes = require("./routes/user");
//importing userBots
const userBots = require("./routes/userbots");

//const yahoo = require("./routes/yahoo");
//creating express app
const app = express();

mongoose.connect("mongodb+srv://Diego:Runner123@cluster0.m5nr5.mongodb.net/runnerTrader")
.then(() =>{
    console.log('Connected to database!');
})
.catch(() => {
    console.log('Connection Failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "*"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});




app.use("/api/user", userRoutes);
app.use("/api/trades", userBots);
//app.use("api/yahoo",yahoo);

module.exports = app; 