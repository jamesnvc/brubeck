brubeck = exports

brubeck.each = (collection, func) ->
  func.call val, key for key, val of collection

brubeck.bind = (obj, func, boundArgs...) ->
  (args...) ->
    func.apply(obj, boundArgs.concat args)
