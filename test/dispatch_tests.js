var brubeck = require('../lib/brubeck'),
    http    = require('http'),
    url     = require('url');

var testServ = brubeck.createServer({
  GET: {
    '/foo': function(req, res) {
      res.write('foo');
      res.end();
    },

    '/bar': function(req, res) {
      res.write('bar');
      res.end();
    }
  },

  PUT: {
    '/bar': function(req, res) {
      var params = url.parse(req.url, true).query;
      for (var elt in params) {
        if (params.hasOwnProperty(elt)) {
          res.write(elt + ': ' + params[elt] + '\n');
        }
      }
      res.end();
    }
  }
});
testServ.listen(8080);

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
