// jshint esversion:6


// ----Requirements----
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { identity, remove } = require("lodash");
const keys = require('./config/keys')
const passport = require('passport');
const adminRoutes = require('./routes/admin')
const multer = require('multer');
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')

const app = express();

const filestorage =  multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'./images');
    },
    filename : (req,file,cb)=> {
        cb(null,file.fieldname + Date.now() + '-' + file.originalname )
    }
})

const filefilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpg'
       || file.mimetype === 'image/jpeg'
       || file.mimetype === 'image/png'){
           cb(null,true)
       }else{
           cb(null,false)
       }
}


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser())


app.use(cookieSession({
    maxAge : 24*60*60*1000,
    keys :[keys.session.cookieKey]
}))

// initialize pasport

app.use(passport.initialize());
app.use(passport.session())



// ----Startng the database----

mongoose.connect("mongodb://localhost:27017/web4you", {useNewUrlParser: true});


app.use('/images',express.static("images"));
app.use(multer (
      {
        storage : filestorage,
        fileFilter : filefilter
     }
 ).single('postimg')
)



app.use(adminRoutes);


app.get('/', (req,res) => {
    if(req.user){
        res.redirect('/home');
    }else{
        res.render('landing')
    }
    
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
});
  