// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({ 
    email: String, 
    password: String, 
    first_name: String,
    last_name: String,
    phone_no: Number,
    activated: Boolean
}));