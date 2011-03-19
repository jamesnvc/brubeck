var http = require('http'),
    url  = require('url');

exports.test = require('./test/test.js');

exports.createServer = function(servObject) {
  var server = http.createServer(function(request, response) {
    var requestUrl = url.parse(request.url).pathname;
    var methodHandler = servObject[request.method] || {};
    var handler;
    if (requestUrl in methodHandler) {
      handler = methodHandler[requestUrl];
    } else if ('default' in methodHandler) {
      handler = methodHandler.default;
    } else {
      response.writeHead('400', {'Content-Type': 'text/plain'});
      response.write('No handler for request');
      response.end();
      return;
    }
    handler(request, response);
  });
  return server;
};
