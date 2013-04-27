var locomotive = require('locomotive'),
  Color = require('../models/color'),
  passport = require('passport'),
  Controller = locomotive.Controller,
  Account = require('../models/account'),
  AccountController = new Controller();

AccountController.show = function() {
  "use strict";
  var user = this.req.user,
    self = this;
  if (!this.req.isAuthenticated()){
    return this.res.redirect(this.urlFor({controller: 'account', action: 'login' }));
  }
  this.user_name = user.local.name || user.twitter.name || user.facebook.name || user.google.name || 'Strong Mountain Wanderer';

  this.auth = {facebook: facebook.loginURL, twitter: twitter.loginURL, google: google.loginURL};
  Color.find({user: user}, function(err, colors) {
    if (err) {
      throw err;
    }
    if (colors.length > 0 && colors[0].user && String(colors[0].user) === String(user._id)){
      self.colors = colors;
    }
    self.render();
  });
};

AccountController.new = function() {
  "use strict";
  this.render();
};

AccountController.loginForm = function() {
  "use strict";
  this.render();
};

AccountController.create = function() {
  "use strict";
  var account = new Account({
    local: {
      username: this.param('username'),
      email: this.param('email'),
      phone: this.param('phone'),
      name: this.param('name')
    }
  })
  , self = this;
  account.local.password = this.param('password');
  account.save(function (err) {
    if (err){
      return self.redirect(self.urlFor({ action: 'new' }));
    }
    return self.redirect(self.urlFor({ action: 'login' }));
  });
};

AccountController.twitter = function() {
  "use strict";
  passport.authenticate('twitter')(this.req, this.res, this.next);
};

AccountController.twitterCallback = function() {
  "use strict";
  passport.authenticate('twitter', { successRedirect: this.accountPath(), failureRedirect: '/login' })(this.req, this.res, this.next);
};

AccountController.facebook = function() {
  "use strict";
  passport.authenticate('facebook')(this.req, this.res, this.next);
};

AccountController.facebookCallback = function() {
  "use strict";
  passport.authenticate('facebook', { successRedirect: this.accountPath(), failureRedirect: '/login' })(this.req, this.res, this.next);
};

AccountController.google = function() {
  "use strict";
  passport.authenticate('google')(this.req, this.res, this.next);
};

AccountController.googleCallback = function() {
  "use strict";
  passport.authenticate('google', { successRedirect: this.accountPath(), failureRedirect: '/login' })(this.req, this.res, this.next);
};

AccountController.login = function() {
  "use strict";
  passport.authenticate('local', {
    successRedirect: this.urlFor({ action: 'show' }),
    failureRedirect: this.urlFor({ action: 'login' }) }
  )(this.req, this.res, this.next);
};
  
AccountController.logout = function() {
  "use strict";
  this.req.logout();
  this.redirect('/');
};

module.exports = AccountController;
