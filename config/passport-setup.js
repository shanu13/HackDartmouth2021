const passport = require('passport');
const GoogleStrategy=  require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user')


passport.serializeUser( (user,done) => {
    done(null,user._id)
})

passport.deserializeUser((_id,done) => {
    User.findById(_id)
        .then(user => {
        
            done(null,user)
        })
        .catch(err => console.log(err))
  
})
passport.use(
    new GoogleStrategy({
        //options for the strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken,refreshToken,profile,done) => {
        // passport callback function
        const email = profile.emails[0].value

        User.findOne({googleId : profile.id})
            .then(user => {
                if(user){
                    console.log('user Exists')
                    done(null,user);
                }
                else{
                    const newUser = new User({
                        googleId : profile.id,
                        userName : profile.displayName,
                        Email : email
                    })
                    newUser.save()
                        .then(newUser => {
                            console.log(newUser)
                            done(null,newUser)
                        })

                }
            })

    })
)