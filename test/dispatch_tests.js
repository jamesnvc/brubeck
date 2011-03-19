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

var testsFailed = 0;
brubeck.test.server.host = 'localhost';
brubeck.test.server.port = 8080;
var onFail = function() { testsFailed++ };

// Test 1
brubeck.test.server.getTest('/foo', {
  statusCode: 200,
  body: 'foo'
}, onFail);

// Test 2
brubeck.test.server.getTest('/bar', {
  statusCode: 200,
  body: 'bar'
}, onFail);

brubeck.test.server.getTest('/bar', {
  statusCode: 400,
  body: 'bar'
}, onFail);

console.log("Failed " + testsFailed + " tests");

testServ.close();
