var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
  var revealPoint = function(point) {
    point.addClass('point-animate-in-finish');
  }

  for (var i = points.length - 1; i >= 0; i--) {
    revealPoint(points[i]);
  };

};


window.onload = function() {
  var sellingPoints = document.getElementsByClassName('selling-points')[0];

  window.addEventListener('scroll', function(points) {
      console.log("Current offset from the top is " + sellingPoints.getBoundingClientRect().top + " pixels");
  });

}
