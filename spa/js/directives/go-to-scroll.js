innaAppDirectives.directive('goToScrollHotel', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            elm.bind('click', function (evt) {
                console.log(attrs.goToScroll);

                var element = document.querySelector('#' + attrs.goToScroll);

                if (element) {
                    var coords = utils.getCoords(element);
                    var headerHeight = angular.element('.Header').height();
                    var body = angular.element('html, body');
                    body.animate({ scrollTop: (coords.top - headerHeight) - 30 }, 300);
                }
            });
        }
    }
});
