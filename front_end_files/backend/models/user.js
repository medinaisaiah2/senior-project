const mongoose = require("mongoose");
//package to secure unique username validaotr 
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//calling the monggoose plugin to validate usernmae uniqueness 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", userSchema);