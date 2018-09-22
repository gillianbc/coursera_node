const mongoose = require('mongoose');
const dishes = require('./dishes');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    username: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    dishes:[{type: mongoose.Schema.Types.ObjectId, ref: 'Dish'}]
}, {
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;