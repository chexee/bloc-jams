var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
  var revealPoint = function(point) {
    point.setAttribute('class', 'point column third point-animate-in-finish');
  }

  for (var i = points.length - 1; i >= 0; i--) {
    revealPoint(points[i]);
  };
};


window.onload = function() {
  // Automatically animate the points on a tall screen where scrolling can't trigger the animation
  if (window.innerHeight > 950) {
    animatePoints(pointsArray);
  }

  var sellingPoints = document.getElementsByClassName('selling-points')[0];
  var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

  window.addEventListener('scroll', function(points) {
    if (document.body.scrollTop >= scrollDistance) {
      animatePoints(pointsArray);
    }
  });

}
