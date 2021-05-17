//here we will check if the user is authenticated 
const jwt = require("jsonwebtoken");

//getting the toekn created from the header using the express authorization add in 
module.exports = (req, res, next) => {
    try{
    const token = req.headers.authorization.split(" ")[1];
    //using jwt verify method to verify token 
    const decodedToken = jwt.verify(token, "this_is_the_secret_code_used");
    req.userData = {email: decodedToken.emial, userId: decodedToken.userId};
    next(); //if the toekn is verified  
    } catch(error){
        res.status(401).json({message: "Auth Failed"});
    }
};

//need to import middleware into the homeservice file 
//not done yet 