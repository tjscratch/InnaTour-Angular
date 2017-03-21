innaAppDirectives.directive('hotelCard', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/hotel-card/templ/hotel-card.html"),
        scope: {
            hotel: '=',
            hotelUrl: '=',
            guestCount: '=',
            typeEtap: '='
        },
        link: function (scope, elem, attr) {
            var HotelGalleryComponent = null;
        },
        controller: function ($scope, $location) {

            $scope.gtmHotelsBuySearch = function () {
                var dataLayerObj = {
                    'event': 'UM.Event',
                    'Data': {
                        'Category': 'Hotels',
                        'Action': 'HotelsBuySearch',
                        'Label': '[no data]',
                        'Content': '[no data]',
                        'Context': '[no data]',
                        'Text': '[no data]'
                    }
                };
                console.table(dataLayerObj);
                if (window.dataLayer) {
                    window.dataLayer.push(dataLayerObj);
                }
            };
            
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
            room: '=',
            price: '=',
            guestCount: '='
        },
        controller: function ($scope, $location) {

            console.log('DADSDASD', $scope.room);
            console.log('DADSDASD', $scope.hotel);

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
