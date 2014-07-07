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
                        sortersFillerCtrlName: '@innaDynamicSerpSorterSortersFillerCtrlName',
                        bundle: '=innaDynamicSerpSorterBundle'
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

                                $scope.$emit('Dynamic.SERP.*.Sorting');
                            }

                            /*Initial*/
                            $scope.$on('Dynamic.SERP.Tab.Loaded', function(){
                                var defaultSorter = $scope.sorters.all[0];

                                $scope.select(defaultSorter);
                            });
                        }
                    ]
                }
            }])
        .controller('innaDynamicSerpSorter_TicketsMixin', [
            '$scope',
            function ($scope) {
                function createVirtualBundles(ticket1, ticket2) {
                    var virtualBundle1 = new inna.Models.Dynamic.Combination();
                    var virtualBundle2 = new inna.Models.Dynamic.Combination();

                    virtualBundle1.hotel = virtualBundle2.hotel = $scope.bundle.hotel;

                    virtualBundle1.ticket = ticket1;
                    virtualBundle2.ticket = ticket2;

                    return [virtualBundle1, virtualBundle2];
                }

                $scope.sorters.add(new Sorter('По цене пакета', function (ticket1, ticket2) { //asc
                    var vbs = createVirtualBundles(ticket1, ticket2);

                    return vbs[0].getFullPackagePrice() - vbs[1].getFullPackagePrice();
                }));
                $scope.sorters.add(new Sorter('По рейтингу Инна Тур', function (ticket1, ticket2) { //asc
                    return ticket1.data.RecommendedFactor - ticket2.data.RecommendedFactor;
                }));
                $scope.sorters.add(new Sorter('По времени в пути', function (ticket1, ticket2) {
                    return (ticket2.data.TimeTo + ticket2.data.TimeBack) - (ticket1.data.TimeTo + ticket1.data.TimeBack)
                }));
                $scope.sorters.add(new Sorter('По времени отправления ТУДА', function (ticket1, ticket2) { //desc
                    return +ticket1.data.DepartureDate - +ticket2.data.DepartureDate;
                }));
                $scope.sorters.add(new Sorter('По времени отправления ОБРАТНО', function (ticket1, ticket2) { //desc
                    return +ticket1.data.BackDepartureDate - +ticket2.data.BackDepartureDate;
                }));
                $scope.sorters.add(new Sorter('По времени прибытия ТУДА', function (ticket1, ticket2) {
                    return +ticket2.data.ArrivalDate - +ticket1.data.ArrivalDate;
                }));
                $scope.sorters.add(new Sorter('По времени прибытия ОБРАТНО', function (ticket1, ticket2) {
                    return +ticket2.data.BackArrivalDate - +ticket1.data.BackArrivalDate;
                }));
            }
        ])
        .controller('innaDynamicSerpSorter_HotelsMixin', [
            '$scope',
            function ($scope) {
                function createVirtualBundles(hotel1, hotel2) {
                    var virtualBundle1 = new inna.Models.Dynamic.Combination();
                    var virtualBundle2 = new inna.Models.Dynamic.Combination();

                    virtualBundle1.ticket = virtualBundle2.ticket = $scope.bundle.ticket;

                    virtualBundle1.hotel = hotel1;
                    virtualBundle2.hotel = hotel2;

                    return [virtualBundle1, virtualBundle2];
                }

                $scope.sorters.add(new Sorter('По цене пакета', function (hotel1, hotel2) { //desc
                    var vbs = createVirtualBundles(hotel1, hotel2);

                    return vbs[0].getFullPackagePrice() - vbs[1].getFullPackagePrice();
                }));
                $scope.sorters.add(new Sorter('По рейтингу Инна Тур', function (hotel1, hotel2) { //desc
                    return hotel1.data.RecommendFactor - hotel2.data.RecommendFactor;
                }));
                $scope.sorters.add(new Sorter('По рейтингу Trip Advisor', function (hotel1, hotel2) { //desc
                    return hotel2.data.TaFactor - hotel1.data.TaFactor;
                }));
                $scope.sorters.add(new Sorter('По названию', function (hotel1, hotel2) { //ask
                    var a = (hotel2.data.HotelName || '').toLowerCase();
                    var b = (hotel1.data.HotelName || '').toLowerCase();

                    //suddenly it works this way
                    if (a < b) return 1;
                    else return -1;
                }));
                $scope.sorters.add(new Sorter('По размеру скидки в руб.', function (hotel1, hotel2) { //desc
                    var vbs = createVirtualBundles(hotel1, hotel2);

                    return vbs[1].getProfit() - vbs[0].getProfit();
                }));
            }
        ]);
})();