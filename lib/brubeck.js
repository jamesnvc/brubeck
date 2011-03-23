var http = require('http'),
    url  = require('url');

exports.util = require('./util/util.js');

exports.createServer = function(servObject) {
  var server = http.createServer(function(request, response) {
    var urlObj = url.parse(request.url, true);
    var requestUrl = urlObj.pathname;
    var methodHandler = servObject[request.method] || {};
    var handler;
    var context = {
      params: urlObj.query,
      request: request
    };
    // TODO: Regex dispatch?
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
    handler.call(context, response);
    response.end();
  });
  return server;
};
