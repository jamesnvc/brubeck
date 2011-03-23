var brubeck = require('../lib/brubeck'),
    assert  = require('assert'),
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

exports['test GET /foo'] = function() {
  assert.response(testServ, {
    url: '/foo'
  }, {
    body: 'foo',
    status: 200
  });
};

exports['test GET /bar'] = function() {
  assert.response(testServ, {
    url: '/bar'
  }, {
    status: 200,
    body: 'bar'
  });
};

exports['test GET nonexistant'] = function() {
  assert.response(testServ, {
    url: '/quux'
  }, {
    status: 400,
    body: 'No handler for request'
  });
};

exports['test PUT'] = function() {
  assert.response(testServ, {
    url: '/bar?foo=1&quux=2',
    method: 'PUT'
  }, {
    status: 200,
    body: 'foo: 1\nquux: 2\n'
  });
};
