exports.each = (collection, func) ->
  func.call(val, key) for key, val of collection
