innaAppControllers
    .controller('DynamicPackageSERPCtrl', [
        '$scope', 'DynamicFormSubmitListener', 'DynamicPackagesDataProvider', 'DynamicPackagesCacheWizard',
        '$routeParams', 'innaApp.API.events', '$location', 'innaApp.Urls', 'aviaHelper',
        function ($scope, DynamicFormSubmitListener, DynamicPackagesDataProvider, DynamicPackagesCacheWizard,
                  $routeParams, Events, $location, Urls, aviaHelper) {
            /*Private*/
            var searchParams = angular.copy($routeParams);
            var cacheKey = '';
            var AS_MAP_CACHE_KEY = 'serp-as-map';

            function loadTab(cb) {
                var method, param, apply;

                if($scope.show == $scope.HOTELS_TAB) {
                    method = 'getHotelsByCombination';
                    param = $scope.combination.AviaInfo.VariantId1;
                    apply = function($scope, data){ $scope.hotels = data.Hotels; };
                } else if($scope.show == $scope.TICKETS_TAB) {
                    method = 'getTicketsByCombination';
                    param = $scope.combination.Hotel.HotelId;
                    apply = function($scope, data){ $scope.tickets = data.AviaInfos; };
                }

                if(!method || !param) return;

                DynamicPackagesDataProvider[method](param, searchParams, function(data){
                    $scope.$apply(function($scope){
                        apply($scope, data);

                        (cb || angular.noop)();
                    });
                });
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

                $location
                    .search('hotel',$scope.combination.Hotel.HotelId)
                    .search('ticket', $scope.combination.AviaInfo.VariantId1);
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

            $scope.show = (function(search){
                if(search.displayTicket) return $scope.TICKETS_TAB;
                if(search.deisplayHotel) return $scope.HOTELS_TAB;

                return $scope.HOTELS_TAB;
            })($location.search());
            // JFYI !!+val does the following magic: convert val into integer (+val) and then convert to boolean (!!)
            $scope.asMap = !!+DynamicPackagesCacheWizard.require(AS_MAP_CACHE_KEY);

            $scope.showLanding = true;
            $scope.baloon = aviaHelper.baloon;
            $scope.baloon.showWithClose('Подбор комбинаций', 'Подождите, пожалуйста', function(){
                console.log('SEARCH BALLOON IS CLOSED');
            });

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
                        console.log('HOTEL DETAILS', resp);
                    });
            };

            $scope.getTicketDetails = function(ticket){
                $scope.$broadcast(Events.DYNAMIC_SERP_TICKED_DETAILED_REQUESTED, ticket);
            };

            $scope.changeHotelsView = function(){
                $scope.asMap = !$scope.asMap;
            };

            $scope.setHotel = function(hotel){
                updateCombination({Hotel: hotel});
            };

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
            };

            /*Initial Data fetching*/
            (function() {
                searchParams.StartVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.StartVoyageDate);
                searchParams.EndVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.EndVoyageDate);
                searchParams.Children && (searchParams.ChildrenAges = searchParams.Children.split('_'));

                if($location.search().hotel) searchParams['HotelId'] = $location.search().hotel;
                if($location.search().ticket) searchParams['TicketId'] = $location.search().ticket;

                DynamicPackagesDataProvider.search(searchParams, function(data){
                    cacheKey = data.SearchId;

                    $scope.$apply(function($scope){
                        updateCombination({
                            Hotel: data.RecommendedPair.Hotel,
                            AviaInfo: data.RecommendedPair.AviaInfo
                        });

                        $scope.showLanding = false;
                        $scope.baloon.hide();
                    });

                    loadTab(function(){
                        if($location.search().displayTicket) {
                            try{
                                var ticketIds = $location.search().displayTicket.split('_');
                                var ticket = null;

                                for(var i = 0; ticket = $scope.tickets[i++];) {
                                    if(ticket.VariantId1 == ticketIds[0] && ticket.VariantId2 == ticketIds[1]) break;
                                }

                                if(ticket) {
                                    $scope.getTicketDetails(ticket);
                                } else throw 1;
                            } catch(e) {
                                //todo display error allert "Can't load ticket, it's most probably already sold"
                            }
                        }
                    });
                });
            })();
        }
    ])
    .controller('DynamicPackageSERPTicketPopupCtrl', [
        '$scope', '$element', '$location', 'innaApp.API.events', 'aviaHelper',
        function($scope, $element, $location, Events, aviaHelper){
            /*DOM dirty hacks*/
            $(function(){
                $(document.body).append($element);
            });

            /*Models*/
            function Ticket(){
                this.data = null;
            }

            Ticket.prototype.setData = function(data) {
                this.data = angular.copy(data);

                if(this.data) {
                    for(var i = 0, dir = ''; dir = ['To', 'Back'][i++];) {
                        var etaps = this.data['Etaps' + dir];

                        for(var j = 0, len = etaps.length; j < len; j++) {
                            etaps[j] = new Ticket.Etap(etaps[j]);
                        }
                    }
                }
            };

            Ticket.__getDuration = function(raw, hoursIndicator, minutesIndicator){
                var hours = Math.floor(raw / 60);
                var mins = raw % 60;

                return hours + ' ' + hoursIndicator + (
                    mins ? (' ' + mins + ' ' + minutesIndicator) : ''
                );
            };

            Ticket.prototype.dropData = function(){
                this.setData(null);
            };

            Ticket.prototype.getDuration = function(dir){
                return Ticket.__getDuration(this.data['Time' + dir], 'ч.', 'мин.');
            };

            Ticket.prototype.getEtaps = function(dir) {
                return this.data['Etaps' + dir];
            };

            Ticket.prototype.getNextEtap = function(dir, current){
                var etaps = this.getEtaps(dir);
                var i = etaps.indexOf(current);

                return etaps[++i];
            }

            Ticket.Etap = function(data){
                this.data = data;
            };

            Ticket.Etap.prototype.getDateTime = function(dir) {
                return dateHelper.apiDateToJsDate(this.data[dir + 'Time']);
            };

            Ticket.Etap.prototype.getDuration = function(){
                return Ticket.__getDuration(this.data.WayTime, 'ч.', 'м');
            };

            Ticket.Etap.prototype.getLegDuration = function(){
                var a = dateHelper.apiDateToJsDate(this.data.InTime);
                var b = dateHelper.apiDateToJsDate(this.data.NextTime);
                var diffMSec = b - a;
                var diffMin = Math.floor(diffMSec / 60000);

                return Ticket.__getDuration(diffMin, 'ч.', 'мин.');
            };

            /*Scope Properties*/
            $scope.ticket = new Ticket();

            /*Scope Methods*/
            $scope.closePopup = function(){
                //drop ?displayTicket = ...
                delete $location.$$search.displayTicket;
                $location.$$compose();

                $scope.ticket.dropData();
            };

            $scope.getTime = function(date) {
                return [date.getHours(), date.getMinutes()].join(':');
            };

            $scope.getDate = function(date) {
                return [date.getDate(), dateHelper.translateMonth(date.getMonth())].join(' ')
            };

            $scope.getDay = function(date) {
                return dateHelper.translateDay(date.getDay());
            };

            $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;

            /*Listeners*/
            $scope.$on(Events.DYNAMIC_SERP_TICKED_DETAILED_REQUESTED, function(event, data){
                $scope.ticket.setData(data);

                $location.search('displayTicket', [$scope.ticket.data.VariantId1, $scope.ticket.data.VariantId2].join('_'));
            });
        }
    ]);