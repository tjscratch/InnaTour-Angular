innaAppDirectives.directive('innaOffer', function ($templateCache) {
    return {
        restrict: 'E',
        template: $templateCache.get("components/inna-offer/templ/offer.html"),
        scope: {
            // partnerSite: "@",
            // partnerName: "@",
        },
        controller: function ($element, $scope, $http, $q) {
            // $scope.partnerDefaultLocation = 'Россия';
            $scope.isGetCode = false;
            $scope.offer = null;

            $scope.getOffer = function () {
                $q.all([
                    $http({
                        method: 'GET',
                        url: 'https://inna.ru/api/v1/Dictionary/GetCurrentLocation',
                        cache: true
                    }),
                    $http({
                        method: 'GET',
                        url: 'https://inna.ru/api/v1/Dictionary/Hotel',
                        params: {term: $scope.location},
                        cache: true
                    })
                ]).then(function (result1, result2) {
                    var countryIdLocation = result1[0].Id;
                    var countryIdTo = result2[0][0].Id;

                    return $http({
                        method: 'GET',
                        url: 'https://inna.ru/api/v1/bestoffer/GetOffersForLocation',
                        params: {ArrivalLocation: countryIdTo, Location: 18820},
                        cache: true
                    })
                }).then(function (result) {
                    $scope.offer = result.Offers[0];
                });
            };

            $scope.getCode = function () {
                $scope.isGetCode = true;
            }
        }
    }
});