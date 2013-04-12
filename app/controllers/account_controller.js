var locomotive = require('locomotive')
, passport = require('passport')
, Controller = locomotive.Controller
, Account = require('../models/account')
, AccountController = new Controller();

AccountController.show = function() {
  "use strict";
  if (!this.req.isAuthenticated()){
    return this.res.redirect(this.urlFor({ action: 'login' }));
  }

  this.user = this.req.user;
  this.render();
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
  var account = new Account()
  , self = this;

  account.username = this.param('username');
  account.email = this.param('email');
  account.password = this.param('password');
  account.name = this.param('name');

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
  passport.authenticate('twitter', { successRedirect: this.accountPath(), failureRedirect: '/fail' })(this.req, this.res, this.next);
};

AccountController.facebook = function() {
  "use strict";
  passport.authenticate('facebook')(this.req, this.res, this.next);
};

AccountController.facebookCallback = function() {
  "use strict";
  passport.authenticate('facebook', { successRedirect: this.accountPath(), failureRedirect: '/fail' })(this.req, this.res, this.next);
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
