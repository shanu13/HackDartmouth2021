"use strict";

const Post = require('../models/post');

const User = require('../models/user');

const passport = require('passport');

const passportSetup = require('../config/passport-setup');

exports.getHome = function (req, res, next) {
  Post.find({}, function (err, posts) {
    console.log(posts);
    res.render("home", {
      posts: posts
    });
  });
};

// ---Compose Routes---
exports.getCompose = function (req, res, next) {
  res.render("compose");
};


exports.postCompose = function (req, res, next) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    name: req.body.composerName,
    email: req.body.composerEmail
  });
  Post.findOne({
    title: req.body.postTitle
  }, function (err, obj) {
    if (!obj) {
      post.save(function (err) {
        if (!err) {
          res.redirect("/");
        }
      });
    } else {
      res.redirect("/exists");
    }
  });
};


exports.getExists = function (req, res, next) {
  res.render("exists");
};

// ---Signup Routes---

exports.getSignup = function (req,res,next) {
  res.render("signup");
};

exports.postSignup = function (req,res,next) {
  console.log("postSignup");
  const email = req.body.signup_email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password; 
  console.log(email + " " + firstName + " " + lastName + " " + password);
  const user = new User({
    fname: firstName,
    lName: lastName,
    Email: email,
    Password: password
  });
  user.save(function(err){
    
    if (!err){
      console.log('user saved');
        res.redirect("/");
    }else{
      console.log(err);
    }
  });
};

// ---Login Routes---

exports.getLogin = function(req,res,next) {
  res.render("login");
};

exports.postLogin = function(req,res,next){
  passport.authenticate('local', { successRedirect: '/',failureRedirect: '/login' });
};

// ---Delete Routes---

exports.deletePost = function (req,res,next) {
  const postId = req.params.postId
 console.log('post deleting')
 console.log(postId);

  Post.findById({_id : postId})
      .then(post => {
        console.log('image deleting')
        return deleteFile(post.imageUrl)
      })
      .then(result => {
        console.log('post deleted')
        Post.deleteOne({_id : postId} ,(err) => {
          if(err){
            console.log(err);
            return
          }
          res.status(200).json({redirect : '/'})
        })
      })
      .catch(err => {
        console.log(err);
      })
};

exports.getGoogle = passport.authenticate('google',{
  scope: ['profile']
});