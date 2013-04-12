module.exports = function routes() {
  this.root('pages#main');
  this.resource('account');
  this.get('login', 'account#loginForm');
  this.post('login', 'account#login');
  this.match('auth/twitter/', 'account#twitter');
  this.match('auth/twitter/callback/', 'account#twitterCallback');
  this.match('auth/facebook/', 'account#facebook');
  this.match('auth/facebook/callback/', 'account#facebookCallback');
  this.match('logout', 'account#logout');
};
