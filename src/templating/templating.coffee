Mu = require 'mu'
u  = require '../util/util.js'

exports.templateRoot = './views'
exports.layout = 'layout.html'
exports.muOptions = {}

exports.render = (view, contextObj, layout=exports.layout) ->
  Mu.templateRoot = exports.templateRoot
  Mu.compile view, (err, compiled) =>
    throw err if err
    buffer = []
    compiled(contextObj)
      .addListener('data', (c) -> buffer.push c)
      .addListener 'end', =>
        Mu.compile layout, (layoutErr, layoutCompiled) =>
          throw layoutErr if layoutErr
          buffer2 = []
          layoutCompiled(u.merge(contextObj, yield: buffer.join('')))
            .addListener('data', (c) -> buffer2.push c)
            .addListener('end', =>
              @write buffer2.join ''
              @end()
            )
  return 4321 # brubeck.WAIT
