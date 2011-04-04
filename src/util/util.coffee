util = exports

util.each = (collection, func) ->
  func.call val, key for key, val of collection

util.bind = (obj, func, boundArgs...) ->
  (args...) ->
    func.apply(obj, boundArgs.concat args)

util.merge = (objects...) ->
  newObj = {}
  for obj in objects
    for key, val of obj
      if obj.hasOwnProperty key
        newObj[key] = val
  newObj
