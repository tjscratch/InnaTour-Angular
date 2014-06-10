(function () {
    /*Common models*/
    var Sorter = function (caption, sortingFn) {
        this.caption = caption;
        this.sortingFn = sortingFn;
    };

    angular.module('innaApp.directives')
        .directive('innaDynamicSerpSorter', [
            '$templateCache',
            function ($templateCache) {
                return {
                    template: $templateCache.get('components/dynamic-serp-sorter.html'),
                    scope: {
                        items: '=innaDynamicSerpSorterItems',
                        sortersFillerCtrlName: '@innaDynamicSerpSorterSortersFillerCtrlName'
                    },
                    controller: [
                        '$scope', '$controller', '$element',
                        function ($scope, $controller, $element) {
                            /*Mixins*/
                            $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                            /*Models*/
                            var Sorters = function () {
                                this.all = [];
                                this.current = null;
                            };

                            Sorters.prototype.add = function (sorter) {
                                this.all.push(sorter);
                            };

                            /*Properties*/
                            $scope.sorters = new Sorters();
                            $controller($scope.sortersFillerCtrlName, {$scope: $scope});


                            /*Methods*/
                            $scope.select = function (sorter) {
                                $scope.sorters.current = sorter;
                                $scope.items.sort(sorter.sortingFn);
                                $scope.popup.isOpen = false;
                            }

                            /*Initial*/
                            $scope.select($scope.sorters.all[0]);
                        }
                    ]
                }
            }])
        .controller('innaDynamicSerpSorter_TicketsMixin', [
            '$scope',
            function ($scope) {
                $scope.sorters.add(new Sorter('По рекомендованности', function (ticket1, ticket2) {
                    return ticket2.data.RecommendedFactor - ticket1.data.RecommendedFactor;
                }));
                $scope.sorters.add(new Sorter('По цене', function (ticket1, ticket2) {
                    return ticket2.data.Price - ticket2.data.Price;
                }));
                $scope.sorters.add(new Sorter('По времени в пути', function (ticket1, ticket2) {
                    return (ticket2.data.TimeTo + ticket2.data.TimeBack) - (ticket1.data.TimeTo + ticket1.data.TimeBack)
                }));
                $scope.sorters.add(new Sorter('По дате/времени отправления ТУДА', function (ticket1, ticket2) {
                    return +ticket2.data.DepartureDate - +ticket1.data.DepartureDate;
                }));
                $scope.sorters.add(new Sorter('По дате/времени отправления ОБРАТНО', function (ticket1, ticket2) {
                    return +ticket2.data.BackDepartureDate - +ticket1.data.BackDepartureDate;
                }));
                $scope.sorters.add(new Sorter('По дате/времени прибытия ТУДА', function (ticket1, ticket2) {
                    return +ticket2.data.ArrivalDate - +ticket1.data.ArrivalDate;
                }));
                $scope.sorters.add(new Sorter('По дате/времени прибытия ОБРАТНО', function (ticket1, ticket2) {
                    return +ticket2.data.BackArrivalDate - +ticket1.data.BackArrivalDate;
                }));
            }
        ])
        .controller('innaDynamicSerpSorter_HotelsMixin', [
            '$scope',
            function ($scope) {
                $scope.sorters.add(new Sorter('По стоимости за пакет', function (hotel1, hotel2) {
                    return hotel2.data.MinimalPackagePrice - hotel1.data.MinimalPackagePrice;
                }));
                $scope.sorters.add(new Sorter('По рекомендованности', function (hotel1, hotel2) {
                    return hotel1.data.RecommendFactor - hotel2.data.RecommendFactor;
                }));
                $scope.sorters.add(new Sorter('По рейтингу TripAdvisor', function (hotel1, hotel2) {
                    return hotel1.data.TaFactor - hotel2.data.TaFactor;
                }));
                $scope.sorters.add(new Sorter('По названию', function (hotel1, hotel2) {
                    var a = (hotel2.data.HotelName || '').toLowerCase();
                    var b = (hotel1.data.HotelName || '').toLowerCase();

                    //suddenly it works like so
                    if (a < b) return 1;
                    else return -1;
                }));
                $scope.sorters.add(new Sorter('По размеру скидки в %', function (hotel1, hotel2) {
                    return hotel2.data.MinimalPackagePrice / hotel2.data.MinimalPrice -
                        hotel1.data.MinimalPackagePrice / hotel1.data.MinimalPrice;
                }));
                $scope.sorters.add(new Sorter('По размеру скидки в руб.', function (hotel1, hotel2) {
                    return (hotel2.data.MinimalPackagePrice - hotel2.data.MinimalPrice) -
                        (hotel1.data.MinimalPackagePrice - hotel1.data.MinimalPrice);
                }));
            }
        ]);
})();