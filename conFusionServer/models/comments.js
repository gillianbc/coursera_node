const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

var Comments = mongoose.model('Comment', commentSchema);

module.exports = Comments;