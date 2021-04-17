const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema ({

    googleId : {
        type: 'String',
        required : true
    },

    userName : {
        type : String,
        required : true
    },
   
    Email : {
        type: String,
        required : true
    }
   
})

module.exports = mongoose.model('User',userSchema)