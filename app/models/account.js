var mongoose = require('mongoose')
, Schema = mongoose.Schema
, Email = mongoose.Schema.Types.Email
, Url = mongoose.Schema.Types.Url
, bcrypt = require('bcrypt');

var AccountSchema = new Schema({
  username: {type: String},
  phone: {type: String},
  email: { type: String, unique: true },
  twitter: {
    twitterID: {'type': String, index: { sparse: true }},
    twitterToken: {'type': String},
    profile_image_url: {'type': Url},
    twitterTokenSecret: {'type': String},
    twitterUsername: {'type': String}
  },
  facebook: {
    id: {'type': String, index: { sparse: true }},
    username: {'type': String},
    gender: {'type': String},
    profileUrl: {'type': String},
    email: {'type': String},
    name: {'type': String},
    accessToken: {'type': String},
    refreshToken: {'type': String},
  },
  // Password
  salt: { type: String},
  hash: { type: String},
  name: {type: String}
});

AccountSchema.virtual('password').get(function () {
  "use strict";
  return this._password;
}).set(function (password) {
  "use strict";
  this._password = password;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      // !!!!!!!!  Dunno what 'this' points to . this may or not be correct. May need 'that'. Should point to AccountSchema
      this.hash = hash;
    });
  });
});

AccountSchema.method('checkPassword', function (password, callback) {
  "use strict";
  bcrypt.compare(password, this.hash, callback);
});

AccountSchema.static('localAuthenticate', function (email, password, callback) {
  "use strict";
  this.findOne({ email: email }, function(err, user) {
    if (err){
      return callback(err);
    }

    if (!user){
      return callback(null, false);
    }

    user.checkPassword(password, function(err, passwordCorrect) {
      if (err){
        return callback(err);
      }
      if (!passwordCorrect){
        return callback(null, false);
      }
      return callback(null, user);
    });
  });
});

AccountSchema.static('findTwitter', function (token, tokenSecret, profile, callback){
  "use strict";
  this.findOne({'twitter.twitterID': profile.id}, callback);
});

AccountSchema.static('findFacebook', function (token, tokenSecret, profile, callback){
  "use strict";
  this.findOne({'facebook.id': profile.id}, callback);
});

module.exports = mongoose.model('Account', AccountSchema);