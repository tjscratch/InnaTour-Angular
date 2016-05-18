innaAppDirectives.directive('offers', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/offers/templ/offers.html"),
        controller: function ($scope, RavenWrapper, serviceCache, Offer) {

            function setDefaultValue (res) {

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
                } else {
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

                var CategoryObj = _.find($scope.Categories, function (item) {
                    return item.Selected == true;
                });
                $scope.filter.Category = CategoryObj.Value;

                var SortObj = _.find($scope.Sorts, function (item) {
                    return item.Selected == true;
                });
                $scope.Sort = SortObj.Value;
                $scope.offersSort($scope.Sort);
            };

            $scope.showOffers = false;

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
                    console.log(res);
                    RavenWrapper.raven({
                        captureMessage: 'Offer.getOffers(): ERROR!',
                        dataResponse: res,
                        dataRequest: null
                    });
                });

            $scope.setCategory = function (category) {
                var categories = [];
                for (var i = 0; i < $scope.Categories.length; i++) {
                    var item = $scope.Categories[i];
                    if (category == item) {
                        item.Selected = true;
                    } else {
                        item.Selected = false;
                    }
                    categories.push(item);
                }
                $scope.Categories = categories;
                $scope.filter.Category = category.Value;
                $scope.filterChange($scope.filter);
            };

            $scope.filterChange = function (filter) {
                Offer.getOffers(filter).then(
                    function (res) {
                        console.log(res.data);
                        $scope.showOffers = true;
                    }, function (res) {
                        RavenWrapper.raven({
                            captureMessage: 'Offer.getOffers(filter): ERROR!',
                            dataResponse: res,
                            dataRequest: $scope.filter
                        });
                    });

            };

            var offers = Offer.mock(12);
            $scope.offersSort = function (sortableType) {
                $scope.offers = Offer.sortable(sortableType, offers);
            };

        }
    }
});
