const Post = require('../models/post')

const User = require('../models/user')


const fs = require('fs')
const passport = require('passport')
const post = require('../models/post')
const passportSetup = require('../config/passport-setup');

const deleteFile = (filepath) => {
    fs.unlink(filepath, (err) => {
        console.log(err);
    })
}



exports.getHome = (req, res, next) => {
    Post.find({}, function(err, posts) {
        console.log(posts);
        const id = req.user._id
        console.log(id);
        res.render("home", {
            posts: posts,
            user: req.user,
            id: id
        });
    });


    console.log('user', req.user)
}






exports.getSignup = (req, res, next) => {
    res.render("signup");
}

exports.postSignup = (req, res, next) => {
    const email = req.body.signup_email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;

    User.find({ Email: email }, function(err, obj) {
        if (!obj) {
            const user = new User({
                fName: firstName,
                lName: lastName,
                Email: email,
                Password: password
            });
            user.save(function(err) {
                console.log(email + " " + firstName + " " + lastName + " " + password);
                if (!err) {
                    console.log('user saved');
                    res.redirect("/login");
                }
            });
        } else {
            res.send("<h1>Error,email already exists</h1>");
        }
    })

}

exports.getLogin = (req, res, next) => {
    res.render("login");
}

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' });
}

exports.getCompose = (req, res, next) => {
    res.render("compose", {
        user: req.user
    });
}

exports.postCompose = (req, res, next) => {
    const { title, body, name, email, tech, timezone, university, year, github, linkedin } = req.body
    const imageUrl = req.file.path;
    console.log(req.body);
    console.log(imageUrl)
    const post = new Post({
        title: title,
        imageUrl: imageUrl,
        content: body,
        name: name,
        email: email,
        techStack: tech,
        link: { github, linkedin },
        timezone: timezone,
        education: { university, year },
        user: req.user
    });
    console.log('post created')
    Post.findOne({ title: title }, function(err, obj) {
        console.log('post finding')
        if (!obj) {
            post.save(function(err) {
                console.log('post save')
                if (!err) {
                    res.redirect("/home");
                } else {
                    console.log(err);
                }
            });
        } else {
            res.redirect("/exists");
        }
    });
}

exports.getExists = (req, res, next) => {
    res.render("exists", {
        user: req.user
    });
}


exports.deletePost = (req, res, next) => {
    const postId = req.params.postId
    console.log('post deleting')
    console.log(postId);

    Post.findById({ _id: postId })
        .then(post => {
            console.log('image deleting')
            return deleteFile(post.imageUrl)
        })
        .then(result => {
            console.log('post deleted')
            Post.deleteOne({ _id: postId }, (err) => {
                if (err) {
                    console.log(err);
                    return
                }
                res.status(200).json({ redirect: '/' })
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getGoogle = passport.authenticate('google', {
    scope: ['profile']
});


exports.getMessage = (req, res) => {
  const roomId = req.params.userId
  res.render('message',{ 
      roomId : roomId
  })
  
}