var brubeck = require('../lib/brubeck'),
    assert  = require('assert'),
    http    = require('http'),
    url     = require('url'),
    query   = require('querystring'),
    u       = brubeck.util;

var testServ = brubeck.createServer({
  GET: {
    '/foo': function() {
      this.write('foo');
    },

    '/bar': function() {
      this.write('bar');
    },

    '/long': function() {
      setTimeout(u.bind(this, function() {
        this.write('done');
        this.end();
      }), 500);
      return brubeck.WAIT;
    }
  },

  PUT: {
    '/bar': function() {
      var write = this.write;
      u.each(this.params, function(param) {
        write(param + ': ' + this + '\n');
      });
    }
  },

  POST: {
    '/baz': function() {
      var write = this.write;
      u.each(this.params, function(datum) {
        write(datum + ': ' + this + '\n');
      });
    },

    default: function() {
      this.writeHead(201, {'Content-Type': 'application/x-www-form-urlencoded'});
      this.write(this.data);
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

exports['test POST'] = function() {
  assert.response(testServ, {
    url: '/baz',
    method: 'POST',
    data: 'foo=1&bar=aoeu'
  }, {
    status: 200,
    body: 'foo: 1\nbar: aoeu\n'
  });
};

exports['test POST default'] = function() {
  assert.response(testServ, {
    url: '/quux',
    method: 'POST',
    data: 'jackdaws=love&my=sphinx'
  }, {
    status: 201,
    body: 'jackdaws=love&my=sphinx'
  });
};

exports['test long-running GET'] = function() {
  assert.response(testServ, {
    url: '/long'
  }, {
    status: 200,
    body: 'done'
  });
};
