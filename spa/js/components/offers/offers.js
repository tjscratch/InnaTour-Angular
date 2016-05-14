innaAppDirectives.directive('offers', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/offers/templ/offers.html"),
        link: function (scope, elem, attr) {

        },
        controller: function ($scope, serviceCache, Offer) {

            // /BestOffer/GetOffers?Location=6733&Period=0&Category=0&Month=0

            $scope.filter = {
                Category: null,
                Location: null,
                Month: null,
                Period: null
            };

            Offer.getOffers().then(
                function (res) {
                    setDefaultValue(res);
                }, function (res) {
                    console.log('/BestOffer/GetOffers ERROR');
                    console.log(res);
                });


            function setDefaultValue(res) {

                $scope.Categories = res.data.Categories;
                $scope.Locations = res.data.Locations;
                $scope.Months = res.data.Month;
                $scope.Periods = res.data.Period;
                $scope.Sorts = res.data.Sort;


                var LocationObj = _.find($scope.Locations, function (item) {
                    return item.Selected == true;
                });
                if (!LocationObj) {
                    /**
                     * если локация сохранена в кеше то берем её оттуда
                     * если кэш путой подставляем id Москвы 6733
                     */
                    var cacheLocation = serviceCache.getObject('DP_from');
                    var cacheLocationId = cacheLocation ? cacheLocation.Id : 6733;
                    LocationObj = _.find($scope.Locations, function (item) {
                        return item.Value == cacheLocationId;
                    });
                    $scope.filter.Location = LocationObj.Value;
                }else{
                    $scope.filter.Location = LocationObj.Value;
                }
                var MonthObj = _.find($scope.Months, function (item) {
                    return item.Selected == true;
                });
                $scope.filter.Month = MonthObj.Value;

                var PeriodObj = _.find($scope.Periods, function (item) {
                    return item.Selected == true;
                });
                $scope.filter.Period = PeriodObj.Value;

                $scope.Sort = _.find($scope.Sorts, function (item) {
                    return item.Selected == true;
                });

            }


            $scope.filterChange = function (filter) {
                console.log(filter);
                Offer.getOffers(filter).then(
                    function (res) {
                        console.log(res.data);
                    }, function (res) {
                        console.log('/BestOffer/GetOffers ERROR');
                        console.log(res);
                    });

            };


            $scope.offersSort = function (sortableType) {
                console.log('offersSort');
                console.log(sortableType);
            };


//
//
//
//
//
//
// генерация офферов
//
//
//
//
//
//
            function randomInteger(min, max) {
                var rand = min + Math.random() * (max - min)
                rand = Math.round(rand);
                return rand;
            }

            var offers = [];
            for (var i = 0; i < 34; i++) {
                var offer = {
                    img: "http://s.test.inna.ru/Files/Photos/140221190450/140221191248/p_960x428.jpg",
                    titleSub: "Куба",
                    titleMain: "Гавана",
                    titleInfo: "7 ночей, на двоих",
                    priceTxt: "от",
                    priceValue: randomInteger(20000, 300000)
                };
                offers.push(offer);
            }

            $scope.offers = _.partitionArray(offers, 3);

        }
    }
});
