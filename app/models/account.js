var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Email = mongoose.Schema.Types.Email,
  Url = mongoose.Schema.Types.Url,
  ObjectId = mongoose.Schema.Types.ObjectId,
  bcrypt = require('bcrypt'),
  AccountSchema = new Schema({
    like: [ObjectId],
    recentTagSearched: [{"tag": {type: String}, "date": Date}],
    local: {
      name: {type: String},
      username: {type: String, unique: true },
      phone: {type: String, unique: true },
      email: { type: Email, unique: true },
      salt: { type: String},
      hash: { type: String}
    },
    twitter: {
      id: {'type': String, index: { sparse: true }},
      username: {'type': String},
      name: {type: String},
      email: { type: String},
      profile_image_url: {'type': Url},
      token: {'type': String},
      tokenSecret: {'type': String}
    },
    facebook: {
      id: {'type': String, index: { sparse: true }},
      username: {'type': String},
      gender: {'type': String},
      link: {'type': String},
      email: {'type': String},
      name: {'type': String},
      updatedTime: Date,
      accessToken: {'type': String},
      refreshToken: {'type': String}
    },
    google: {
      id: {'type': String, index: { sparse: true }},
      profileUrl: {'type': String},
      name: {'type': String},
      email: {'type': String}
    }
  }, {autoIndex: false});

AccountSchema.virtual('local.password').get(function () {
  "use strict";
  console.log('CALLED GET PASSWORD');
  return this._password;
}).set(function (password) {
  "use strict";
  var self = this;
  this._password = password;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      if (err){
        throw err;
      }
      self.local.salt = salt;
      self.local.hash = hash;
      self.save(function (err) {
        if (err){
          throw err;
        }        
      });
    });
  });
});

AccountSchema.method('checkPassword', function (password, callback) {
  "use strict";
  bcrypt.compare(password, this.local.hash, callback);
});

AccountSchema.static('localAuthenticate', function (login, password, callback) {
  "use strict";
  this.findOne({$or: [{'local.username': login}, {'local.phone': login}, {'local.email': login}]}, function(err, user) {
    if (err){
      return callback(err);
    }
    if (!user){
      return callback(null, false);
    }
    else{
      user.checkPassword(password, function(err, passwordCorrect) {
        if (err){
          return callback(err);
        }
        if (!passwordCorrect){
          return callback(null, false);
        }
        return callback(null, user);
      });
    }
  });
});

AccountSchema.static('findTwitter', function (profile, callback){
  "use strict";
  this.findOne({'twitter.id': profile.id}, callback);
});

AccountSchema.static('findFacebook', function (profile, callback){
  "use strict";
  this.findOne({'facebook.id': profile.id}, callback);
});

AccountSchema.static('findGoogle', function (identifier, callback){
  "use strict";
  this.findOne({'google.id': identifier}, callback);
});

// AccountSchema.static('findLocal', function (login, callback){
//   "use strict";
//   this.findOne({$or: [{'local.username': login}, {'local.phone': login}, {'local.email': login}]}, callback);
// });

module.exports = mongoose.model('Account', AccountSchema);