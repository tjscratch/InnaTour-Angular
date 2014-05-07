angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaPrice', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.price.html',
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaPriceTickets',
                    filters: '=innaDynamicSerpFilterAviaPriceFilters'
                },
                controller: [
                    '$scope', 'innaApp.API.events', '$element', '$controller',
                    function($scope, Events, $element, $controller){
                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*DOM*/
                        var slider = $('.js-range', $element);
                        var input = $('.js-range-val', $element);

                        /*Models*/
                        var Options = inna.Models.Avia.Filters._OptionsFactory();

                        Options.prototype.hasSelected = function(){
                            var onlyOption = this.options[0];

                            return onlyOption.value !== onlyOption.defaultValue;
                        }

                        var Option = inna.Models.Avia.Filters._OptionFactory(function(){
                            this.value = 0;
                            this.max = 0;
                            this.min = Number.MAX_VALUE;
                            this.defaultValue = 0;
                        });

                        Option.prototype.reset = function(){
                            this.value = this.defaultValue;
                        };

                        Option.prototype.describe = function(){
                            return 'Не дороже ~ рублей'.split('~').join(this.value);
                        };

                        /*Properties*/
                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('Price'));
                        $scope.option = new Option('Цена');
                        $scope.options = $scope.filter.options = new Options();
                        $scope.filter.options.push($scope.option);
                        $scope.filter.filterFn = function(ticket){
                            if(ticket.data.Price > $scope.option.value) ticket.hidden = true;
                        }

                        /*Methods*/
                        $scope.displayOnSlider = function(){
                            slider.slider('value', $scope.option.value);
                        };

                        $scope.reset = function(option) {
                            option.reset();
                            $scope.displayOnSlider();
                        }

                        /*Watchers*/
                        var unwatchCollectionTickets = $scope.$watchCollection('tickets', function(newVal) {
                            if(!newVal || !newVal.list.length) return;

                            $scope.option.min = newVal.getMinPrice();
                            $scope.option.max = newVal.getMaxPrice();
                            $scope.option.defaultValue = $scope.option.max;

                            slider.slider({
                                range: "min",
                                min: $scope.option.min,
                                max: $scope.option.max,
                                value: $scope.option.max,
                                slide: function(event, ui) {
                                    $scope.$apply(function($scope){
                                        $scope.option.value = ui.value;
                                    });
                                }
                            });

                            $scope.filter.options.reset();

                            unwatchCollectionTickets();
                        });

                        $scope.$watch('option.value', function(){
                            $scope.option.selected = ($scope.option.value !== $scope.option.defaultValue);
                        });
                    }
                ]
            }
        }
    ]);