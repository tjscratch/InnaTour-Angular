innaAppDirectives.directive('hotelCard', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/hotel-card/templ/hotel-card.html"),
        scope: {
            hotel: '=',
            hotelUrl: '='
        },
        link: function (scope, elem, attr) {
            var HotelGalleryComponent = null;
        },
        controller: function ($scope, $location) {
            
            $scope.currentActive = function(route) {
                var loc = $location.path();
                var abs = $location.absUrl();

                if (route == '/') {
                    return ((abs.indexOf('/tours/?') > -1) || loc == route);
                }
                else {
                    if (loc.indexOf(route) > -1)
                        return true;
                    else
                        return false;
                }
            };
        }
    }
});
innaAppDirectives.directive('hotelCardInfo', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/hotel-card/templ/hotel-card-info.html"),
        scope: {
            hotel: '=',
            hotelRoom: '=',
            hotelUrl: '='
        },
        controller: function ($scope, $location) {

            $scope.currentActive = function(route) {
                var loc = $location.path();
                var abs = $location.absUrl();

                if (route == '/') {
                    return ((abs.indexOf('/tours/?') > -1) || loc == route);
                }
                else {
                    if (loc.indexOf(route) > -1)
                        return true;
                    else
                        return false;
                }
            };
        }
    }
});
