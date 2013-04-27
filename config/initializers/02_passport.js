var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Account = require('../../app/models/account'),
  TwitterStrategy = require('passport-twitter').Strategy,
  GoogleStrategy = require('passport-google').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy;

// Twitter auth
  passport.use(new TwitterStrategy({
    consumerKey: twitter.consumerKey,
    consumerSecret: twitter.consumerSecret,
    callbackURL: twitter.callbackURL,
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done) {
    "use strict";
    var twit = {
      username: profile.username,
      id: profile.id,
      token: token,
      tokenSecret: tokenSecret,
      email: profile.email,
      name: profile.name
    }, key;
    for(key in twit) {
      if(!twit[key]) {
        delete twit[key];
      }
    }
  //     console.log(twit);
    if (req.user && !req.user.twitter.id){
      // Need to associate 
      Account.findByIdAndUpdate(req.user._id, {
        twitter: twit
      }, {'new': true}, function(err, user){
        if (err) { 
          // console.log(err);
          return done(err); 
        }
        req.user = user;
        return done(null, req.user);
      });
    }
    else {
      Account.findTwitter(profile, function(err, user) {
        if (err) { return done(err); }
        if (!user){
          var newUser = new Account({
            twitter: twit
          });
          newUser.save(function(err) {
            if (err) {
              // console.log('OH MAY GOASAS');
              // console.log(err);
              return done(err);
            }
          });
          // console.log('We have a new twitter user: '+newUser);
          return done(null, newUser);
        }
        else{
          // console.log('We have an existing twitter user: '+user);
          return done(null, user);
        }
      });
    }
  }));

// Google auth
  passport.use(new GoogleStrategy({
    realm: google.realm,
    returnURL: google.returnURL,
    passReqToCallback: true
  },
  function(req, identifier, profile, done) {
    "use strict";
    var goo = {
      id: identifier,
      name: profile.displayName,
      email: profile.emails[0].value
    }, key;
    for(key in goo) {
      if(!goo[key]) {
        delete goo[key];
      }
    }
    if (req.user && !req.user.google.id){
      // Need to associate account
      Account.findByIdAndUpdate(req.user._id, {
        google: goo
      }, {'new': true}, function(err, user){
        if (err) { 
          // console.log(err);
          return done(err); 
        }
        req.user = user;
        return done(null, req.user);
      });
    }
    else {    
      Account.findGoogle(identifier, function(err, user) {
        if (err) { return done(err); }
        if (!user){
          var newUser = new Account({
            google: goo
          });
          newUser.save(function(err) {
            if (err) {
              return done(err);
            }
          });
          // console.log('We have a new google user: '+newUser);
          return done(null, newUser);
        }
        // console.log('We have an existing google user: '+user);
        return done(null, user);
      });
    }
  }));

// Facebook auth
  passport.use(new FacebookStrategy({
      clientID: facebook.clientID,
      clientSecret: facebook.clientSecret,
      callbackURL: facebook.callbackURL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      "use strict";
      var fb = {
        id: profile._json.id,
        username: profile._json.username,
        gender: profile._json.gender,
        link: profile._json.link,
        email: profile._json.email,
        name: profile._json.name,
        updatedTime: profile._json.updated_time,
        accessToken: accessToken,
        refreshToken: refreshToken
      }, key;
      for(key in fb) {
        if(!fb[key]) {
          delete fb[key];
        }
      }
      // console.log(fb);
      // console.log(profile);
      if (req.user && !req.user.facebook.id){
        // Need to associate account
        Account.findByIdAndUpdate(req.user._id, {
          facebook: fb
        }, {'new': true}, function(err, user){
          if (err) { 
            // console.log(err);
            return done(err); 
          }
          req.user = user;
          return done(null, req.user);
        });
      }
      else {  
        Account.findFacebook(profile, function(err, user) {
          if (err) { return done(err); }
          if (!user){
            var newUser = new Account({
              facebook: fb
            });
            newUser.save(function(err, newUser) {
              if (err) {
                // console.log('Facebook error!');
                // console.log(err);
                return done(err);
              }
              else{
                // console.log('We have a new facebook user: '+newUser);
                return done(null, newUser);
              }
            });
          }
          else{
            // console.log('We have an existing facebook user: '+user);
            return done(null, user);
          }
        });
      }
    })
  );

// Use the LocalStrategy within Passport.
  passport.use(new LocalStrategy({
      usernameField: 'login',
      passReqToCallback: true
    },
    function(req, login, password, done) {
      "use strict";
      // Find the user by username, email, or phone-number.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure.  Otherwise, return the authenticated `user`.
      Account.localAuthenticate(login, password, function(err, user) {
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