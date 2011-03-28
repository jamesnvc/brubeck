http = require 'http'
url  = require 'url'
util = require './util/util.js'

exports.util = util

exports.createServer = (servObject) ->
  server = http.createServer (request, response) ->
    urlObj        = url.parse request.url, true
    requestUrl    = urlObj.pathname
    methodHandler = servObject[request.method] || {}
    if requestUrl of methodHandler
      handler = methodHandler[requestUrl]
    else if 'default' of methodHandler
      handler = methodHandler.default
    else
      handler = ->
        response.writeHead '400', 'Content-Type': 'text/plain'
        response.write 'No handler for request'
    context =
      params: urlObj.query
      request: request
      response: response
      data: null
      write: exports.util.hitch(response, response.write)
      writeHead: exports.util.hitch(response, response.writeHead)
    recieved = []
    request.on 'data', (chunk) -> recieved.push chunk
    request.on 'end', ->
      context.data = recieved.join ''
      handler.call context
      response.end()
  server

