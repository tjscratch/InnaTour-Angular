angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaTime', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.time.html',
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaTimeTickets'
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

                        function Option(direction, state, baseOption){
                            this.direction = direction;
                            this.state = state;
                            this.caption = baseOption.caption;
                            this.start = baseOption.start;
                            this.end = baseOption.end;

                            this.isAvailable = false;
                            this.isChecked = false;
                        }

                        function Options() {
                            this.options = [];
                        }

                        Options.prototype.push = function(option) {
                            this.options.push(option);
                        };

                        Options.prototype.reset = function(dir) {
                            for(var i = 0, option = null; option = this.options[i++];) {
                                if(option.direction == dir) option.isChecked = false;
                            }
                        }

                        function State(property, caption, direction) {
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

                        function Direction(name, prefix, caption) {
                            this.name = name;
                            this.caption = caption;
                            this.prefix = prefix;

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
                            new Direction('To', '', 'Перелет туда'),
                            new Direction('Back', 'Back', 'Перелет обратно')
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
                                        options.push(new Option(dir, state, baseOption));
                                    }
                                }
                            }

                            return options;
                        })();

                        /*Methods*/
                        $scope.changeState = function(dir, state){
                            dir.states.setCurrent(state);

                            $scope.onChangeOption();
                        }

                        $scope.onChangeOption = function(){
                            $scope.$emit(Events.DYNAMIC_SERP_FILTER_TICKET, {filter: 'Time', value: $scope.options});
                        };

                        $scope.reset = function(dir) {
                            $scope.options.reset(dir);
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
                                    option.isAvailable = true;
                                }
                            }

                            unwatchCollectionTickets();
                        });
                    }
                ]
            };
        }
    ]);