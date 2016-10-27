innaAppDirectives.directive('innaOffer', function () {
    return {
        restrict   : 'E',
        templateUrl: '/spa/LK/offer.html',
        scope      : {
            // partnerSite: "@",
            // partnerName: "@",
        },
        controller : function ($element, $scope, $http, $q, $sce, $timeout, LocationService) {
            
            /**
             * поиск "Город/Название отеля"
             */
            $scope.getSuggest = function (text) {
                return LocationService.getSuggest(text)
                    .then(function (data) {
                        return data;
                    });
            };
            
            $scope.offerLocation = null;
            
            $scope.widgetShow = false;
            $scope.getOfferCode = function () {
                $scope.widgetCode = '<div class="widget-inna-offer" data-location="'+$scope.offerLocation.name+'"></div><script charset="utf-8" src="//inna.ru/spa/js/widgets/offer/inna-offer.js"></script>'
                $timeout(function () {
                    $(".widget-preview").html($scope.widgetCode);
                },150)
                $scope.widgetShow = true;
            };
            
            // $scope.partnerDefaultLocation = 'Россия';
            $scope.isGetCode = false;
            $scope.offer = null;
            
            $scope.getOffer = function () {
                $q.all([
                    $http({
                        method: 'GET',
                        url   : 'https://inna.ru/api/v1/Dictionary/GetCurrentLocation',
                        cache : true
                    }),
                    $http({
                        method: 'GET',
                        url   : 'https://inna.ru/api/v1/Dictionary/Hotel',
                        params: {term: $scope.location},
                        cache : true
                    })
                ]).then(function (result1, result2) {
                    var countryIdLocation = result1[0].Id;
                    var countryIdTo = result2[0][0].Id;
                    
                    return $http({
                        method: 'GET',
                        url   : 'https://inna.ru/api/v1/bestoffer/GetOffersForLocation',
                        params: {ArrivalLocation: countryIdTo, Location: 18820},
                        cache : true
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


innaAppDirectives.service('LocationService', function ($http, $q) {
    return {
        getSuggest: function (text) {
            var deferred = $q.defer();
            
            function prepareData(response) {
                var data = [];
                angular.forEach(response, function (item) {
                    var fullName = item.Name;
                    var fullNameHtml = "<span class='b-search-form-hotels-typeahead-list-item__country'>" + item.Name + "</span>, " +
                        "<span class='b-search-form-hotels-typeahead-list-item__name'>" + item.CountryName + "</span>";
                    data.push({id: item.Id, nameHtml: fullNameHtml, name: fullName});
                });
                return data;
            }
            
            $http({
                url   : "https://inna.ru/api/v1/Hotels/SuggestionList",
                method: "GET",
                params: {
                    searchterm: text.split(', ')[0].trim()
                }
            }).success(function (data) {
                deferred.resolve(prepareData(data));
            });
            
            return deferred.promise;
        }
    }
});
