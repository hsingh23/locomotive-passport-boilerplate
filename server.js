var locomotive = require('locomotive'),
  address = process.env.VCAP_APP_HOST || '0.0.0.0',
  env = process.env.NODE_ENV || 'development',
  port =  process.argv[2] || process.env.VMC_APP_PORT || process.env.PORT || 3000;

console.log(process.argv);

locomotive.boot(__dirname, env, function(err, server) {
  if (err) { throw err; }
  server.listen(port, address, function() {
    var addr = this.address();
    console.log('listening on %s:%d', addr.address, addr.port);
  });
});
