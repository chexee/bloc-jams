var animatePoints = function() {
  var revealPoint = function() {
    $(this).addClass('point-animate-in-finish');
  }

  $.each($('.point'), revealPoint);
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
