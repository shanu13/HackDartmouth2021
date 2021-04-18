// hint esversion:6
// ----Requirements----
const express = require("express");
const app = express();
const server = require('http').createServer(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const keys = require('./config/keys')
const passport = require('passport');
const adminRoutes = require('./routes/admin')
const multer = require('multer');
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const io = require('socket.io')(server);




const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + '-' + file.originalname)
    }
})

const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cookieParser())


app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}))

// initialize pasport

app.use(passport.initialize());
app.use(passport.session())



// ----Startng the database----
const uri = 'mongodb+srv://shantanu:shantanu@cluster0.hktq0.mongodb.net/HackDartmouth?retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true }, () => {
    console.log('mongodb connected')
});


app.use('/images', express.static("images"));
app.use(multer({
    storage: filestorage,
    fileFilter: filefilter
}).single('postimg'))



app.use(adminRoutes);


app.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/home');
    } else {
        res.render('landing')
    }

})



io.on('connection', socket => {
    socket.on('join-room',(roomID) => {
        socket.join(roomID)
        console.log('room joined')
        io.to(roomID).emit('user-connected',roomID)

        socket.on('send', (message) => {
            socket.broadcast.to(roomID).emit('recieve',message)
        })

     
    
    })

   
})

const port = process.env.PORT || 3000


server.listen(port, function() {
    console.log(`server started on port ${port}`);
})
