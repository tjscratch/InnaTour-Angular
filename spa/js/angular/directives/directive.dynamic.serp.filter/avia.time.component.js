angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaTime', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.time.html',
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaTimeTickets',
                    filters: '=innaDynamicSerpFilterAviaTimeFilters'
                },
                controller: [
                    '$scope', 'innaApp.API.events', '$element', '$controller',
                    function($scope, Events, $element, $controller) {
                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*Models*/
                        function BaseOption(caption, start, end){
                            this.start = start;
                            this.end = end;
                            this.caption = caption;
                        }

                        var Option = inna.Models.Avia.Filters._OptionFactory(function(title, direction, state, baseOption){
                            this.direction = direction;
                            this.state = state;
                            this.caption = baseOption.caption;
                            this.start = baseOption.start;
                            this.end = baseOption.end;
                        });

                        Option.prototype.describe = function(){
                            return [
                                this.state.caption,
                                this.direction.desc + ':',
                                this.caption
                            ].join(' ');
                        };

                        var Options = inna.Models.Avia.Filters._OptionsFactory();

                        Options.prototype.resetDir = function(dir) {
                            this.each(function(option){
                                if(option.direction == dir) option.selected = false;
                            });
                        };

                        function State(property, caption) {
                            this.caption = caption;
                            this.property = property;

                            this.isCurrent = false;
                        }

                        function States(list) {
                            this.states = list;

                            this.setCurrent(this.states[0]);
                        }

                        States.prototype.setCurrent = function(state){
                            for(var i = 0, st = null; st = this.states[i++];) {
                                if(st == state) st.isCurrent = true;
                                else st.isCurrent = false;
                            }
                        };

                        States.prototype.getCurrent = function(){
                            for(var i = 0, st = null; st = this.states[i++];) {
                                if(st.isCurrent) return st;
                            }

                            return null;
                        };

                        function Direction(name, prefix, caption, desc) {
                            this.name = name;
                            this.caption = caption;
                            this.prefix = prefix;
                            this.desc = desc;

                            this.states = new States([
                                new State('ArrivalDate', 'Вылет'),
                                new State('DepartureDate','Прилет')
                            ]);
                        }

                        function Directions(list) {
                            this.directions = list;
                        }

                        /*Properties*/
                        $scope.directions = new Directions([
                            new Direction('To', '', 'Перелет туда', 'туда'),
                            new Direction('Back', 'Back', 'Перелет обратно', 'обратно')
                        ]);

                        $scope.options = (function(){
                            var options = new Options();
                            var baseOptions = [
                                new BaseOption('Утро', 6, 12),
                                new BaseOption('День', 12, 18),
                                new BaseOption('Вечер', 18, 0),
                                new BaseOption('Ночь', 24, 6)
                            ];

                            for(var i = 0, dir = null; dir = $scope.directions.directions[i++];) {
                                for(var j = 0, state = null; state = dir.states.states[j++];) {
                                    for(var k = 0, baseOption = null; baseOption = baseOptions[k++];) {
                                        options.push(new Option(baseOption.caption, dir, state, baseOption));
                                    }
                                }
                            }

                            return options;
                        })();

                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('Time'));
                        $scope.filter.options = $scope.options;
                        $scope.filter.filterFn = function(ticket){
                            function checkOptionsInsideCategory(ticket, options) {
                                if(!options.options.length) return true;

                                var fits = false;

                                options.each(function(option){
                                    var propertyName = [option.direction.prefix, option.state.property].join('');
                                    var date = ticket.data[propertyName];
                                    fits = fits || dateHelper.isHoursBetween(date, option.start, option.end);
                                });

                                return fits;
                            }

                            var optionsOfInterest = {};

                            this.options.getSelected().each(function(option){
                                if(option.direction.states.getCurrent() != option.state) return;

                                (
                                    optionsOfInterest[option.direction.name] ||
                                    (optionsOfInterest[option.direction.name] = new Options())
                                ).push(option);
                            });

                            var fits = true;

                            for(var p in optionsOfInterest) if(optionsOfInterest.hasOwnProperty(p)) {
                                fits = fits && checkOptionsInsideCategory(ticket, optionsOfInterest[p]);
                            }

                            if(!fits) {
                                ticket.hidden = true;
                            }
                        };

                        /*Methods*/
                        $scope.changeState = function(dir, state){
                            dir.states.setCurrent(state);

                            $scope.options.getSelected().each(function(option){
                                if(option.direction != dir) return;

                                if(option.state != state) option.selected = false;
                            });
                        }

                        $scope.reset = function(dir) {
                            $scope.options.resetDir(dir);
                        }

                        /*Watchers*/
                        var unwatchCollectionTickets = $scope.$watchCollection('tickets', function(tickets){
                            if(!tickets || !tickets.list.length) return;

                            for(var i = 0, option = null; option = $scope.options.options[i++];) {
                                var atLeastOne = tickets.advancedSearch(function(ticket){
                                    var propertyName = [option.direction.prefix, option.state.property].join('');
                                    var date = ticket.data[propertyName];

                                    return dateHelper.isHoursBetween(date, option.start, option.end);
                                });

                                if(atLeastOne) {
                                    option.shown = true;
                                }
                            }

                            unwatchCollectionTickets();
                        });
                    }
                ]
            };
        }
    ]);