var express = require('express')
, passport = require('passport')
, mongoose = require('mongoose')
, MongoStore = require('connect-mongo')(express);

module.exports = function() {
  // Warn of version mismatch between global "lcm" binary and local installation
  // of Locomotive.
  if (this.version !== require('locomotive').version) {
    console.warn(util.format('version mismatch between local (%s) and global (%s) Locomotive module', require('locomotive').version, this.version));
  }
  this.datastore(require('locomotive-mongoose'));
  this.set('views', __dirname + '/../../app/views');
  this.set('view engine', 'jade');

  // Register jade as a template engine.
  this.engine('jade', require('jade').__express);
  this.format('html', { extension: '.jade' });

  this.use(express.logger());
  this.use(express.cookieParser());
  this.use(express.bodyParser());
  this.use(express.session({
    secret: 'yo',
    store: new MongoStore({
      db: 'skylines'
    })
  }));
  this.use(passport.initialize());
  this.use(passport.session());
  this.use(this.router);
  this.use(express.static(__dirname + '/../../public'));
  console.log(__dirname + '/../../public');

};
