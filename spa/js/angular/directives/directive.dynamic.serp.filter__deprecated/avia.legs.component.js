angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaLegs', [
        '$templateCache',
        function($templateCache){
            return {
                template: $templateCache.get('components/dynamic-serp-filter/avia.legs.html'),
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaLegsTickets',
                    filters: '=innaDynamicSerpFilterAviaLegsFilters',
                    bundle: '=innaDynamicSerpFilterAviaLegsBundle'
                },
                controller: [
                    '$scope', 'innaApp.API.events', '$element', '$controller',
                    function($scope, Events, $element, $controller){
                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*Models*/
                        var Option = inna.Models.Avia.Filters._OptionFactory(function(title, comparator){
                            this.comparator = comparator;
                            this.minPrice = NaN;
                        });

                        Option.prototype.describe = function(){
                            return this.title;
                        };

                        var Options = inna.Models.Avia.Filters._OptionsFactory();

                        /*Properties*/
                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('Legs'));

                        $scope.filter.options = new Options();
                        $scope.filter.options.push(new Option('Прямой', function(to, back){
                            //true if fits
                            return (to + back == 2);
                        }));
                        $scope.filter.options.push(new Option('1 пересадка', function(to, back){
                            //true if fits
                            var both = to + back;
                            return both == 3 || both == 4;
                        }));

                        $scope.filter.options.push(new Option('2+ пересадки', function(to, back) {
                            //true if fits
                            return (to >= 3) || (back >= 3);
                        }));

                        $scope.filter.filterFn = function(ticket){
                            var options = $scope.filter.options.getSelected();

                            if(!options.options.length) return;

                            var show = false;
                            var legsTo = ticket.getEtaps('To').length;
                            var legsBack = ticket.getEtaps('Back').length;

                            options.each(function(option){
                                show = show || (option.comparator(legsTo, legsBack));
                            });

                            if(!show) ticket.hidden = true;
                        };

                        /*Watchers*/
                        var unwatchCollectionTickets = $scope.$watchCollection('tickets', function(newVal){
                            if(!newVal || !newVal.list.length) return;

                            $scope.filter.options.each(function(option){
                                var tickets = new inna.Models.Avia.TicketCollection();

                                newVal.each(function(ticket){
                                    var fits = option.comparator(ticket.getEtaps('To').length, ticket.getEtaps('Back').length);

                                    if(fits) {
                                        tickets.push(ticket);
                                    }
                                });

                                if(tickets.size()) {
                                    option.shown = true;
                                    option.minPrice = tickets.getMinPrice($scope.bundle);
                                }
                            });

                            console.log('LEGS::options', $scope.filter.options);

                            unwatchCollectionTickets();
                        });
                    }
                ]
            }
        }
    ]);