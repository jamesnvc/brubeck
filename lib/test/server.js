var http  = require('http'),
    path  = require('path'),
    dgram = require('dgram');

exports.host = exports.port || 'localhost';
exports.port = exports.port || 8080;

var tests = [];

exports.addGetTest = function(path, expect) {
  tests.push(function(failed) {
    console.log('Testing "' + path + '"...');
    http.get({
      host: exports.host,
      port: exports.port,
      path: path
    }, function(res) {
      if ('statusCode' in expect) {
        if (res.statusCode !== expect.statusCode) {
          var msg = new Buffer(
            '{"path": "' + path + '", ' +
             '"got": ' + res.statusCode + ', ' +
             '"expected": ' + expect.statusCode + '}'
          );
          var client = dgram.createSocket('unix_dgram');
          client.send(msg, 0, msg.length, failed);
          return;
        }
      }
      if ('body' in expect) {
        res.on('data', function(chunk) {
          var client = dgram.createSocket('unix_dgram');
          if (chunk != expect.body) {
            var msg = new Buffer(
              '{"path": "' + path + '", ' +
               '"got": "' + chunk + '", ' +
               '"expected": "' + expect.body + '"}'
            );
            client.send(msg, 0, msg.length, failed);
          } else {
            var msg = new Buffer('Success!');
            client.send(msg, 0, msg.length, failed);
          }
        });
      }
    });
  });
};

exports.runTests = function() {
  var failed = [];
  var ran = 0;
  var serverPath = path.join('/tmp', 'test.' + process.pid + '.sock');
  var failSock = dgram.createSocket('unix_dgram');
  failSock.on('message', function(msg, rinfo) {
    if (msg != 'Success!') {
      failed.push(JSON.parse(msg));
    }
    ran++;
    if (ran == tests.length) {
      failSock.close();
      if (failed.length !== 0) {
        console.log('Failed ' + failed.length + ' tests.');
        for (var i = 0, len = failed.length; i < len; i++) {
          var fail = failed[i];
          console.log('Failure at ' + fail.path + ': Got "' +
            fail.got + '", expected "' + fail.expected + '".');
        }
      } else {
        console.log('All tests passed!');
      }
      process.exit();
    }
  });
  failSock.bind(serverPath);
  for (var i = 0, len = tests.length; i < len; i++) {
    tests[i](serverPath);
  }
  console.log('Running ' + tests.length + ' tests');
};
