var http  = require('http'),
    path  = require('path'),
    dgram = require('dgram');

exports.host = exports.port || 'localhost';
exports.port = exports.port || 8080;

var tests = [];
var ansiColours = {
  red: '[31;m',
  green: '[32;m',
  white: '[37;m'
};

var addTest = function(method, path, expect) {
  tests.push(function(failed) {
    console.log('Testing ' + method + ' ' + path + '...');
    http.request({
      host: exports.host,
      port: exports.port,
      method: method,
      path: path
    }, function(res) {
      if ('statusCode' in expect) {
        if (res.statusCode !== expect.statusCode) {
          var msg = new Buffer(
            JSON.stringify({
              path: path,
              method: method,
              got: res.statusCode,
              expected: expect.statusCode
            })
          );
          var client = dgram.createSocket('unix_dgram');
          client.send(msg, 0, msg.length, failed);
          return;
        }
      }
      if ('body' in expect) {
        var data = [];
        res.on('data', function(chunk) {
          data.push(chunk);
        });
        res.on('end', function() {
          var recieved = data.join('');
          var client = dgram.createSocket('unix_dgram');
          if (recieved != expect.body) {
            var msg = new Buffer(
              JSON.stringify({
                path: path,
                method: method,
                got: recieved,
                expected: expect.body
              })
            );
            client.send(msg, 0, msg.length, failed);
          } else {
            var msg = new Buffer('Success!');
            client.send(msg, 0, msg.length, failed);
          }
        });
      }
    }).end();
  });
};

exports.addGetTest = function(path, expect) {
  addTest('GET', path, expect);
};

exports.addPutTest = function(path, expect) {
  addTest('PUT', path, expect);
};

exports.runTests = function(onComplete) {
  var failed = [];
  var ran = 0;
  var serverPath = path.join('/tmp', 'test.' + process.pid + '.sock');
  var failSock = dgram.createSocket('unix_dgram');
  failSock.on('message', function(msgBuf, rinfo) {
    var msg = msgBuf.toString('utf-8');
    if (msg != 'Success!') {
      failed.push(JSON.parse(msg));
    }
    ran++;
    if (ran == tests.length) {
      failSock.close();
      if (failed.length !== 0) {
        console.log(ansiColours.red + 'Failed ' + failed.length + ' tests.' +
          ansiColours.white);
        for (var i = 0, len = failed.length; i < len; i++) {
          var fail = failed[i];
          console.log(ansiColours.red + 'Failure: ' + fail.method + ' ' +
            fail.path + ': Got "' + fail.got + '", expected "' +
            fail.expected + '".' + ansiColours.white);
        }
      } else {
        console.log(ansiColours.green + 'All tests passed!' + ansiColours.white);
      }
      if (onComplete) onComplete();
    }
  });
  failSock.bind(serverPath);
  for (var i = 0, len = tests.length; i < len; i++) {
    tests[i](serverPath);
  }
  console.log('Running ' + tests.length + ' tests');
};
