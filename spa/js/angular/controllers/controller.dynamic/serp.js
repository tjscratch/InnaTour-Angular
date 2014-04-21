innaAppControllers
    .controller('DynamicPackageSERPCtrl', [
        '$scope', 'DynamicFormSubmitListener', 'DynamicPackagesDataProvider', 'DynamicPackagesCacheWizard',
        '$routeParams', 'innaApp.API.events', '$location', 'innaApp.Urls',
        function ($scope, DynamicFormSubmitListener, DynamicPackagesDataProvider, DynamicPackagesCacheWizard,
                  $routeParams, Events, $location, Urls) {
            /*Private*/
            var searchParams = angular.copy($routeParams);
            var cacheKey = '';
            var AS_MAP_CACHE_KEY = 'serp-as-map';

            function loadTab() {
                if($scope.show == $scope.HOTELS_TAB) {
                    DynamicPackagesDataProvider.getHotelsByCombination(
                        $scope.combination.AviaInfo.VariantId1, searchParams,
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
                                $scope.tickets = data.AviaInfos;
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
                    if(!value) return true;

                    return (hotel.MinimalPackagePrice <= value);
                },
                Name: function(hotel, value){
                    if(!value) return true;

                    return (hotel.HotelName && hotel.HotelName.indexOf(value) !== -1);
                },
                Extra: function(hotel, value){
                    var show = true;

                    for(var option in value) if(value.hasOwnProperty(option)) {
                        if(!value[option]) continue;

                        show = show && hotel[option];
                    }

                    return show;
                }
            };

            function doesTicketFit(ticket, filter, value) {
                return doesTicketFit.comparators[filter](ticket, value);
            }

            doesTicketFit.comparators = {
                Legs: function(ticket, value){
                    if(angular.equals(value, {})) return true;

                    var show = false;

                    $.each(value, function(i, option){
                        show = show ||
                            (option.comparator(ticket.EtapsTo.length) && option.comparator(ticket.EtapsBack.length));
                    });

                    return show;
                },
                Price: function(ticket, value) {
                    if(!value) return true;

                    return ticket.Price <= value;
                },
                Time: function(ticket, value) {
                    var show = false;

                    if(angular.equals(value, {})) return true;

                    $.each(value, function(key, range){
                        var prop = key.split('.')[0];
                        show = show || dateHelper.isHoursBetween(ticket[prop], range);
                    });

                    return show;
                }
            };

            function updateCombination(o) {
                if(!$scope.combination) $scope.combination = {};

                for(var p in o) if(o.hasOwnProperty(p)) {
                    $scope.combination[p] = o[p];
                }

                $location.search({
                    hotel: $scope.combination.Hotel.HotelId,
                    ticket: $scope.combination.AviaInfo.VariantId1
                });
            }

            /*EventListener*/
            DynamicFormSubmitListener.listen();

            $scope.$on(Events.DYNAMIC_SERP_FILTER_HOTEL, function(event, data){
                $scope.hotelFilters[data.filter] = data.value;

                $scope.$broadcast(Events.DYNAMIC_SERP_FILTER_ANY_CHANGE, {
                    type: 'hotel',
                    filters: angular.copy($scope.hotelFilters)
                });
            });

            $scope.$on(Events.DYNAMIC_SERP_FILTER_TICKET, function(event, data){
                $scope.ticketFilters[data.filter] = data.value;

                $scope.$broadcast(Events.DYNAMIC_SERP_FILTER_ANY_CHANGE, {
                    type: 'ticket',
                    filters: angular.copy($scope.ticketFilters)
                });
            });

            $scope.$on(Events.DYNAMIC_SERP_FILTER_ANY_DROP, function(event, data){
                var eventNameComponent = _.map(data.filter.split('.'), function(component, i){ return i == 0 ? component : '*'; }).join('.');
                $scope.$broadcast(Events.build(Events.DYNAMIC_SERP_FILTER_ANY_DROP, eventNameComponent), data.filter);
            });

            $scope.$watch('show', function(newVal, oldVal){
                if($scope.combination) loadTab();
            });

            $scope.$watch('asMap', function(newVal) {
                DynamicPackagesCacheWizard.put(AS_MAP_CACHE_KEY, +newVal);
            });

            /*Constants*/
            $scope.HOTELS_TAB = '/spa/templates/pages/dynamic/inc/serp.hotels.html';
            $scope.TICKETS_TAB = '/spa/templates/pages/dynamic/inc/serp.tickets.html';

            /*Properties*/
            $scope.hotels = [];
            $scope.hotelFilters = {};
            $scope.tickets = [];
            $scope.ticketFilters = {};
            $scope.combination = null;
            $scope.showLanding = true;

            $scope.show = $scope.HOTELS_TAB;
            // JFYI !!+val does the following magic: convert val into integer (+val) and then convert to boolean (!!)
            $scope.asMap = !!+DynamicPackagesCacheWizard.require(AS_MAP_CACHE_KEY);

            /*Initial Data fetching*/
            (function loadData(){
                searchParams.StartVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.StartVoyageDate);
                searchParams.EndVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.EndVoyageDate);
                searchParams.ChildrenAges = searchParams.Children.split('_');

                if($location.search().hotel) searchParams['HotelId'] = $location.search().hotel;
                if($location.search().ticket) searchParams['TicketId'] = $location.search().ticket;

                console.time('loading_packages');
                console.log('loading data by params', angular.toParam(searchParams));

                DynamicPackagesDataProvider.search(searchParams, function(data){
                    console.timeEnd('loading_packages');

                    cacheKey = data.SearchId;

                    $scope.$apply(function($scope){
                        updateCombination({
                            Hotel: data.RecommendedPair.Hotel,
                            AviaInfo: data.RecommendedPair.AviaInfo
                        });

                        $scope.showLanding = false;
                    });

                    loadTab();
                });
            })();

            /*Methods*/
            $scope.filteredHotels = function(filters){
                var hotelsToShow =  _.filter($scope.hotels, function(hotel){
                    var show = true;

                    $.each(filters, function(filter, value){
                        show = show && doesHotelFit(hotel, filter, value);

                        return show;
                    });

                    return show;
                });

                return hotelsToShow;
            }

            $scope.filteredTickets = function(filters) {
                var ticketsToShow = _.filter($scope.tickets, function(ticket) {
                    var show = true;

                    $.each(filters, function(filter, value){
                        show = show && doesTicketFit(ticket, filter, value);

                        return show;
                    });

                    return show;
                });

                return ticketsToShow;
            }

            $scope.getHotelDetails = function(hotel){
                DynamicPackagesDataProvider.hotelDetails(
                    hotel.HotelId, hotel.ProviderId,
                    $scope.combination.AviaInfo.VariantId1, $scope.combination.AviaInfo.VariantId2,
                    cacheKey, function(resp){
                        console.log(resp);
                    });
            }

            $scope.changeHotelsView = function(){
                $scope.asMap = !$scope.asMap;
            }

            $scope.setHotel = function(hotel){
                updateCombination({Hotel: hotel});
            }

            $scope.goReservation = function(){
                $location.path(Urls.URL_DYNAMIC_PACKAGES_RESERVATION + [
                    $routeParams.DepartureId,
                    $routeParams.ArrivalId,
                    $routeParams.StartVoyageDate,
                    $routeParams.EndVoyageDate,
                    $routeParams.TicketClass,
                    $routeParams.Adult,
                    $routeParams.Children
                ].join('-'));
            }
        }
    ]);