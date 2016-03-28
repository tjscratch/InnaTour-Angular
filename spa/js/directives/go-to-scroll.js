innaAppDirectives.directive('goToScrollHotel', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            elm.bind('click', function (evt) {

                var element = document.querySelector('#' + attrs.goToScrollHotel);

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
