var animatePoints = function() {
    var points = document.getElementsByClassName('point');

    var revealPoint = function(point) {
        point.addClass('point-animate-in-finish');
    }

    for (var i = points.length - 1; i >= 0; i--) {
        revealPoint(points[i]);
    };

};
