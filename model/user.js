const mon = require('mongoose');
const bcrypt = require('bcrypt');
const salt = 10;

const UserSchema = new mon.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    createdOn:{
        type:Date,
        default: Date.now()
    }
});

UserSchema.methods.authenticate = function(username, password, callback){
    User.findOne({username: username}, function(err, user){
        if(err){
            console.log('some error ocurred while looking for user');
            return callback(err)
        }
        else if(!user){
            console.log("user not found");
            //var thiserror = new Error("username/password combination is incorrect");//username not found
            var thiserror = new Error("username/password combination is incorrect");
            return callback(thiserror)
        }
        else{
            //check-check
            console.log('unknown error ocurred');
        }
        bcrypt.compare(password, user.password, function(err, result){
            if(result == true){
                return callback(null, user)
            }
            else{
                //var thiserror = new Error("username/password combination is incorrect");//password did not match username-password pair
                var thiserror = new Error("username/password combination is incorrect");
                return callback(thiserror);
            }
        });

})
}

UserSchema.pre('save',function(next){
    var user = this;
    bcrypt.genSalt(salt, function(err, salt){
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err){
                //console.log("Error ocurred while hashing password");
                return next(err);
            }
            user.password = hash;
            next();
        });
    })
});
const User = mon.model('User',UserSchema);
module.exports = {User};