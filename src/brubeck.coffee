http = require 'http'
url  = require 'url'

exports.util = require './util/util.js'

exports.createServer = (servObject) ->
  server = http.createServer (request, response) ->
    urlObj        = url.parse request.url, true
    requestUrl    = urlObj.pathname
    methodHandler = servObject[request.method] || {}
    context =
      params: urlObj.query
      request: request
      data: null
    recieved = []
    request.on 'data', (chunk) -> recieved.push chunk
    if requestUrl of methodHandler
      handler = methodHandler[requestUrl]
    else if 'default' of methodHandler
      handler = methodHandler.default
    else
      handler = ->
        response.writeHead '400', 'Content-Type': 'text/plain'
        response.write 'No handler for request'
    request.on 'end', ->
      context.data = recieved.join ''
      handler.call context, response
      response.end()
  server

