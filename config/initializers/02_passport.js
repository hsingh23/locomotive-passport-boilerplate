var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , Account = require('../../app/models/account')
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new TwitterStrategy({
    consumerKey: process.env.twitterConsumerKey,
    consumerSecret: process.env.twitterConsumerSecret,
    callbackURL: process.env.twitterCallbackURL
  },
  function(token, tokenSecret, profile, done) {
    "use strict";
    Account.findTwitter(token, tokenSecret, profile, function(err, user) {
      if (err) { return done(err); }
      if (!user){
        var newUser = new Account({
          username: profile.username,
          email: profile.email,
          name: profile.name,
          twitter: {
            twitterID: profile.id,
            twitterToken: token,
            twitterTokenSecret: tokenSecret,
            twitterUsername: profile.username
          }
        });
        newUser.save(function(err) {
          if (err) {
            console.log('OH MAY GOASAS');
            console.log(err);
            return done(err);
          }
        });
        console.log('loggine newUser'+newUser);
        return done(null, newUser);
      }
      console.log('loggine user'+user);
      return done(null, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.facebookClientID,
    clientSecret: process.env.facebookClientSecret,
    callbackURL: process.env.facebookCallbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    "use strict";
    console.log(profile);
    Account.findFacebook(accessToken, refreshToken, profile, function(err, user) {
      if (err) { return done(err); }
      if (!user){
        var newUser = new Account({
          facebook: {
            id: profile.id,
            username: profile.username,
            gender: profile.gender,
            profileUrl: profile.profileUrl,
            email: profile.emails,
            name: profile.displayName,
            accessToken: accessToken,
            refreshToken: refreshToken
          }
        });
        newUser.save(function(err) {
          if (err) {
            console.log('OH MAY FACEOSDKSODK');
            console.log(err);
            done(err);
          }
        });
        console.log('loggine newUser'+newUser);
        return done(null, newUser);
      }
      else{
        console.log('loggine user'+user);
        return done(null, user);
      }
    });
  }
));

// Use the LocalStrategy within Passport.

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    "use strict";
    // Find the user by username.  If there is no user with the given
    // username, or the password is not correct, set the user to `false` to
    // indicate failure.  Otherwise, return the authenticated `user`.
    Account.localAuthenticate(email, password, function(err, user) {
      return done(err, user);
    });
  }
));

// Passport session setup.

passport.serializeUser(function(user, done) {
  "use strict";
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  "use strict";
  Account.findById(id, function (err, user) {
    done(err, user);
  });
});