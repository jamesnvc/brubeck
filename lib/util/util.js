exports.each = function(collection, func) {
  for (var elt in collection) {
    if (collection.hasOwnProperty(elt)) {
      func.call(collection[elt], elt);
    }
  }
};
