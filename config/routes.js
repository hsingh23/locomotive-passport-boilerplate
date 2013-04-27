module.exports = function routes() {
  this.root('pages#main');
  this.get('about','pages#about');

  this.resource('account', { except: ['destroy', 'index'] });
  this.get('login', 'account#loginForm');
  this.post('login', 'account#login');
  this.get('logout', 'account#logout');

  this.resources('colors');
  // should be a put
  this.post('like', 'colors#like')
  
  this.match(twitter.loginURL, 'account#twitter');
  this.match(twitter.callbackURL, 'account#twitterCallback');
  this.match(facebook.loginURL, 'account#facebook');
  this.match(facebook.callbackURL, 'account#facebookCallback');
  this.match(google.loginURL, 'account#google');
  this.match(google.callbackURL, 'account#googleCallback');
};
