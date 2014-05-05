angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaLegs', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.legs.html',
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaLegsTickets'
                },
                controller: [
                    '$scope', 'innaApp.API.events', '$element',
                    function($scope, Events, $element){
                        /*Models*/
                        function Option(id, title, comparator){
                            this.id = id;
                            this.title = title;
                            this.comparator = comparator;

                            this.shown = false;
                            this.selected = false;
                            this.minPrice = NaN;
                        }

                        function Options(options){
                            this.options = options;
                        }

                        Options.prototype.each = function(fn){
                            for(var i = 0, option = null; option = this.options[i++];) {
                                fn.call(this, option);
                            }
                        };

                        Options.prototype.hasSelected = function(){
                            var hasSelected = false;

                            this.each(function(option){
                                hasSelected = hasSelected || option.selected;
                            });

                            return hasSelected;
                        };

                        Options.prototype.getIndicators = function(){
                            var indicators = {};

                            this.each(function(option){
                                if(option.selected) {
                                    indicators[option.id] = option.title;
                                }
                            });

                            return indicators;
                        };

                        /*Properties*/
                        $scope.options = new Options([
                            new Option('Stright', 'Прямой', function(l){ return l == 1; }),
                            new Option('OneJump', '1 пересадка', function(l){ return l == 2; }),
                            new Option('MultipleJumps', '2+ пересадки', function(l) { return l > 2; })
                        ]);

                        $scope.isOpen = false;

                        /*Methods*/
                        $scope.onChange = function(){
                            $scope.$emit(Events.DYNAMIC_SERP_FILTER_TICKET, {filter: 'Legs', value: angular.copy($scope.options)});
                        };

                        $scope.reset = function(){
                            $scope.options.each(function(option){
                                option.selected = false;
                            });

                            $scope.onChange();
                        };

                        $scope.toggle = function(){
                            $scope.isOpen = !$scope.isOpen;
                        }

                        /*Watchers*/
                        var unwatchCollectionTickets = $scope.$watchCollection('tickets', function(newVal){
                            if(newVal && newVal.list.length){
                                $scope.options.each(function(option){
                                    var tickets = new inna.Models.Avia.TicketCollection();

                                    newVal.each(function(ticket){
                                        var fits = option.comparator(ticket.getEtaps('To').length) ||
                                            option.comparator(ticket.getEtaps('Back').length);

                                        if(fits) {
                                            tickets.push(ticket);
                                        }
                                    });

                                    if(tickets.size()) {
                                        option.shown = true;
                                        option.minPrice = tickets.getMinPrice();
                                    }
                                });

                                unwatchCollectionTickets();
                            }
                        });

                        (function(){
                            var doc = $(document);

                            function onClick(event){
                                var isInsideComponent = $.contains($($element)[0], event.target);

                                if(!isInsideComponent) {
                                    $scope.$apply(function($scope){
                                        $scope.isOpen = false;
                                    });
                                }
                            }

                            doc.on('click', onClick);

                            $scope.$on('$destroy', function(){
                                doc.off('click', onClick);
                            });
                        })();

                        $scope.$on(Events.build(Events.DYNAMIC_SERP_FILTER_ANY_DROP, 'Legs.*'), function(event, data){
                            var optionToTurnOff = _.findWhere($scope.options, {id: data.split('.')[1]});

                            optionToTurnOff.selected = false;
                            $scope.onChange();
                        });
                    }
                ]
            }
        }
    ]);