angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaAirlines', function(){
        return {
            templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.airlines.html',
            scope: {
                tickets: '=innaDynamicSerpFilterAviaAirlinesTickets'
            },
            controller: [
                '$scope', '$element', '$controller', 'innaApp.API.events',
                function($scope, $element, $controller, Events){
                    /*Mixins*/
                    $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                    /*Models*/
                    function Option(name, minPrice) {
                        this.name = name;
                        this.minPrice = minPrice;
                        this.selected = false;
                    }

                    /*Properties*/
                    $scope.options = [];

                    /*Methods*/
                    $scope.onChange = function() {
                        $scope.$emit(Events.DYNAMIC_SERP_FILTER_TICKET, {filter: 'Airlines', value: $scope.options});
                    };

                    $scope.reset = function(){
                        for(var i = 0, option = null; option = $scope.options[i++];) {
                            option.selected = false;
                        }

                        $scope.onChange()
                    }

                    /*Watchers*/
                    var unwatchCollectionTickets = $scope.$watchCollection('tickets', function(tickets){
                        if(!tickets || !tickets.list.length) return;

                        var collections = {};

                        tickets.each(function(ticket){
                            for(var i = 0, dir = '', etaps = null; (dir = ['To', 'Back'][i++]) && (etaps = ticket.getEtaps(dir));){
                                for(var j = 0, etap = null; etap = etaps[j++];) {
                                    var tName = etap.data.TransporterName;

                                    if(!collections[tName]) {
                                        collections[tName] = new inna.Models.Avia.TicketCollection();
                                    }

                                    collections[tName].push(ticket);
                                }
                            }
                        });

                        for(var tName in collections) if(collections.hasOwnProperty(tName)) {
                            $scope.options.push(new Option(tName, collections[tName].getMinPrice()));
                        }

                        unwatchCollectionTickets();
                    })
                }
            ]
        }
    });