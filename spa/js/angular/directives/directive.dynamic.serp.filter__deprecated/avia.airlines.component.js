angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaAirlines', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/dynamic-serp-filter/avia.airlines.html'),
            scope: {
                tickets: '=innaDynamicSerpFilterAviaAirlinesTickets',
                filters: '=innaDynamicSerpFilterAviaAirlinesFilters',
                bundle: '=innaDynamicSerpFilterAviaAirlinesBundle'
            },
            controller: [
                '$scope', '$element', '$controller', 'innaApp.API.events',
                function($scope, $element, $controller, Events){
                    /*Mixins*/
                    $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                    /*Models*/
                    var Option = inna.Models.Avia.Filters._OptionFactory(function(name, minPrice){
                        this.minPrice = minPrice
                    });

                    Option.prototype.describe = function(){
                        return this.title;
                    };

                    var Options = inna.Models.Avia.Filters._OptionsFactory();

                    /*Properties*/
                    $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('Airlines'));
                    $scope.filter.options = $scope.options = new Options();
                    $scope.filter.filterFn = function(ticket){
                        var selected = this.options.getSelected();

                        if(!selected.options.length) return;

                        var show = false;
                        var airlines = ticket.collectAirlines().etap;

                        selected.each(function(option){
                            for(var code in airlines) if(airlines.hasOwnProperty(code)) {
                                show = show || (airlines[code] == option.title);
                            }
                        });

                        if(!show) {
                            ticket.hidden = true;
                        }
                    };

                    /*Watchers*/
                    var unwatchCollectionTickets = $scope.$watchCollection('tickets', function(tickets){
                        if(!tickets || !tickets.list.length) return;

                        var collections = {};

                        tickets.each(function(ticket){
                            ticket.everyEtap(function(etap){
                                var tName = etap.data.TransporterName;

                                if(!collections[tName]) {
                                    collections[tName] = new inna.Models.Avia.TicketCollection();
                                }

                                collections[tName].push(ticket);
                            });
                        });

                        for(var tName in collections) if(collections.hasOwnProperty(tName)) {
                            //console.log(collections[tName].getMinPrice(), collections[tName].getMinPrice($scope.bundle));
                            $scope.options.push(new Option(tName, collections[tName].getMinPrice($scope.bundle)));
                        }

                        unwatchCollectionTickets();
                    })
                }
            ]
        }
    }]);