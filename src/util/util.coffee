exports.each = (collection, func) ->
  func.call val, key for key, val of collection

exports.hitch = (obj, func, boundArgs...) ->
  (args...) ->
    func.apply(obj, boundArgs.concat args)
