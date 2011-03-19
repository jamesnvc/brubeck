var http = require('http');

exports.host = exports.port || 'localhost';
exports.port = exports.port || 8080;

exports.getTest = function(path, expect, onFail) {
  http.get({
    host: exports.host,
    port: exports.port,
    path: path
  }, function(res) {
    for (var field in expect) {
      if (expect.hasOwnProperty(field)) {
        if (expect[field] !== res[field]) {
          onFail(field, res, expect);
        }
      }
    }
  });
};
