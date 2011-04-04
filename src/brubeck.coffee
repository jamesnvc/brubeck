http       = require 'http'
url        = require 'url'
query      = require 'querystring'
util       = require './util/util.js'
templating = require './templating/templating.js'

brubeck = exports

brubeck.WAIT = 4321

brubeck.util = util
brubeck.templating = templating

brubeck.createServer = (servObject) ->
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
      write: brubeck.util.bind(response, response.write)
      writeHead: brubeck.util.bind(response, response.writeHead)
      end: brubeck.util.bind(response, response.end)
    context.render = brubeck.util.bind(context, brubeck.templating.render)

    recieved = []
    request.on 'data', (chunk) -> recieved.push chunk
    request.on 'end', ->
      context.data = recieved.join ''
      if request.method is 'POST'
        context.params = query.parse(context.data)
      ret = handler.call context
      if ret isnt brubeck.WAIT
        response.end()
  server
