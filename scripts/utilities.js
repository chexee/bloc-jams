var forEach = function(elements, callback){
  for (var i = elements.length - 1; i >= 0; i--) {
    callback(elements[i]);
  };
}
