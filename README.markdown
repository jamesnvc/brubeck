Brubeck
=======

Brubeck is a simple [Sinatra][]-like microframework for Node.js. Yes, there are
a million of this sort of thing out there, but this one is mine.

Usage
-----

Basic usage looks something like this (using CoffeeScript):

    brubeck = require 'brubeck'
    path    = require 'path'

    brubeck.templating.templateRoot = './templates'

    s = brubeck.createServer
      GET:
        '/': ->
          @writeHead 200, 'Content-Type': 'text/html'
          @render 'main.html',
            pageTitle: 'Index'
            foo: 'The main page'
      PUT:
        '/baz': ->
          @writeHead 201
          do_something_with @params.foo

    s.listen 8080

See `example` for demo of usage.

  [Sinatra]: http://www.sinatrarb.com
