const mongoose = require('mongoose'); 

const transactionSchema = mongoose.Schema({
    stock: { type: String, required: true},
    date: {type:String, required: true},
    transaction: {type: String, required: true},
    price: {type: String, required: true},
    amount: {type: String, required: true},
    total_price: {type: String, required: true}
});

module.exports = mongoose.model('Transactions', transactionSchema);
