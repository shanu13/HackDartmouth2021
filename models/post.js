const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const postSchema = new Schema ({
    title : {
        type : String,
        required : true
    },

    imageUrl : {
        type : String,
        required : true 
    },
    
    content : {
        type: String,
        required : true
    },
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    techStack : {
        type: String,
        required : true
    },
    link :  {
            github : {
                type : String,
                required : true
            },
            linkedin : {
                type : String,
                required : true
            }
        },
    timezone : {
        type : String,
        required : true
    },
    education : {
        university : {
            type : String,
            required : true
        },
        year : {
            type : String,
            required : true
        }
    }
    
})


module.exports = mongoose.model('Post',postSchema)
