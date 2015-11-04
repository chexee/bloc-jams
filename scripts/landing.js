var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
  var revealPoint = function(point) {
    point.setAttribute('class', 'point column third point-animate-in-finish');
  }

  forEach(pointsArray, revealPoint);
};

$(window).load(function() {
  // Automatically animate the points on a tall screen where scrolling can't trigger the animation
  if ($(window).height() > 950) {
    animatePoints(pointsArray);
  }

  var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

  $(window).scroll( function(points) {
    if ( $(window).scrollTop() >= scrollDistance) {
      animatePoints();
    }
  });
});
