var animatePoints = function() {
    var points = document.getElementsByClassName('point');

    var revealPoint = function(point) {
        point.style.opacity = 1;
        point.style.transform = "scaleX(1) translateY(0)";
        point.style.msTransform = "scaleX(1) translateY(0)";
        point.style.WebkitTransform = "scaleX(1) translateY(0)";
    }

    for (var i = points.length - 1; i >= 0; i--) {
        revealPoint(points[i]);
    };

};
