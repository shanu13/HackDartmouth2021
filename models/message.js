const mongoose = require('mongoose');
const user = require('./user');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user :{
        type : mongoose.Schema.Types,
        ref : user
    },
    message : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('Message',messageSchema)