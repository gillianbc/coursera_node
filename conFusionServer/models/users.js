var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    }
});
//The username and password and now plugged in from passportLocalMongoose
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);