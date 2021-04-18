const express = require('express')
const router = express.Router()
const adminController = require('../controller/admincontroller')
const passport = require('passport')


router.get('/home', adminController.getHome);

router.get('/compose', adminController.getCompose)

router.post('/compose', adminController.postCompose)

router.get('/exists', adminController.getExists)

// router.get('/signup',adminController.getSignup)

// router.post('/signup',adminController.postSignup)

router.get('/login', adminController.getLogin)

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/auth/google/redirect',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {

        res.redirect('/home');
    });

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

// router.post('/login',adminController.postLogin)

router.delete('/delete/:postId', adminController.deletePost)

router.get('/message/:userId', adminController.getMessage);

// router.get('/google',adminController.getGoogle)

module.exports = router