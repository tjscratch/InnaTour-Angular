innaAppControllers
    .controller('DynamicPackageSERPCtrl', [
        '$scope', 'DynamicFormSubmitListener', 'DynamicPackagesDataProvider', '$routeParams',
        function ($scope, DynamicFormSubmitListener, DynamicPackagesDataProvider, $routeParams) {
            /*Private*/
            var searchParams = {};
            var cacheKey = '';

            function loadTab() {
                if($scope.show == $scope.HOTELS_TAB) {
                    DynamicPackagesDataProvider.getHotelsByCombination(
                        $scope.combination.Ticket.To.TicketId, searchParams,
                        function(data){
                            $scope.$apply(function($scope){
                                $scope.hotels = data.Hotels;
                            });
                        }
                    );
                } else if($scope.show == $scope.TICKETS_TAB) {
                    DynamicPackagesDataProvider.getTicketsByCombination(
                        $scope.combination.Hotel.HotelId, searchParams,
                        function(data){
                            $scope.$apply(function($scope) {
                                $scope.tickets = data.Tickets;
                            });
                        }
                    );
                }
            }

            function doesHotelFit(hotel, filter, value) {
                return doesHotelFit.comparators[filter](hotel, value);
            }

            doesHotelFit.comparators = {
                Stars: function(hotel, value){
                    if(value == 'all') return true;

                    return (hotel.Stars == value);
                },
                Price: function(hotel, value){
                    return (hotel.MinimalPackagePrice <= value);
                },
                Name: function(hotel, value){
                    if(!value) return true;

                    return (hotel.HotelName && hotel.HotelName.indexOf(value) !== -1);
                }
            }

            /*EventListener*/
            DynamicFormSubmitListener.listen();

            $scope.$on('inna.Dynamic.SERP.Hotel.Filter', function(event, data){
                $scope.hotelFilters[data.filter] = data.value;
            });

            /*Constants*/
            $scope.HOTELS_TAB = '/spa/templates/pages/dynamic_package_serp.hotels.html';
            $scope.TICKETS_TAB = '/spa/templates/pages/dynamic_package_serp.tickets.html';

            /*Properties*/
            $scope.hotels = [];
            $scope.hotelFilters = {};
            $scope.tickets = [];
            $scope.ticketFilters = {};
            $scope.combination = null;
            $scope.showLanding = true;

            $scope.show = $scope.HOTELS_TAB;

            $scope.$watch('show', function(newVal, oldVal){
                if($scope.combination) loadTab();
            });



            /*Data fetching*/
            (function loadData(params){
                params.StartVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(params.StartVoyageDate);
                params.EndVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(params.EndVoyageDate);

                searchParams = params;

                console.time('loading_packages');
                console.log('loading data by params', angular.toParam(params));

                DynamicPackagesDataProvider.search(params, function(data){
                    console.timeEnd('loading_packages');

                    cacheKey = data.SearchId;

                    $scope.$apply(function($scope){
                        $scope.combination = data.RecommendedPair;
                        $scope.showLanding = false;

                        loadTab();
                    });
                });
            })(angular.copy($routeParams));

            /*Methods*/
            $scope.filteredHotels = function(filters){
                console.log('filteredHotels : filter = ', filters);
                return _.filter($scope.hotels, function(hotel){
                    var show = true;

                    $.each(filters, function(filter, value){
                        show = show && doesHotelFit(hotel, filter, value);

                        return show;
                    });

                    return show;
                });
            }

            $scope.getHotelDetails = function(hotel){
                DynamicPackagesDataProvider.hotelDetails(
                    hotel.HotelId, hotel.ProviderId,
                    $scope.combination.Ticket.To.TicketId, $scope.combination.Ticket.Back.TicketId,
                    cacheKey, function(resp){
                        console.log(resp);
                    });
            }
        }
    ]);