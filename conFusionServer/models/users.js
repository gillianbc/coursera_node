var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin:   {
        type: Boolean,
        default: false
    }
});
//The username and password and now plugged in from passportLocalMongoose
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);