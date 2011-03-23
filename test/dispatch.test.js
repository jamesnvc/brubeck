var brubeck = require('../lib/brubeck'),
    http    = require('http'),
    url     = require('url'),
    u       = brubeck.util;

var testServ = brubeck.createServer({
  GET: {
    '/foo': function(res) {
      res.write('foo');
    },

    '/bar': function(res) {
      res.write('bar');
    }
  },

  PUT: {
    '/bar': function(res) {
      u.each(this.params, function(param) {
        res.write(param + ': ' + this + '\n');
      });
    }
  }
});

brubeck.test.server.host = 'localhost';
brubeck.test.server.port = 8080;

// Test 1
brubeck.test.server.addGetTest('/foo', {
  statusCode: 200,
  body: 'foo'
});

// Test 2
brubeck.test.server.addGetTest('/bar', {
  statusCode: 200,
  body: 'bar'
});

brubeck.test.server.addGetTest('/quux', {
  statusCode: 400,
  body: 'No handler for request'
});

brubeck.test.server.addPutTest('/bar?foo=1&quux=2', {
  statusCode: 200,
  body: 'foo: 1\nquux: 2\n'
});

brubeck.test.server.runTests(function() { testServ.close(); });
