angular.module('innaApp.directives')
    .directive('dynamicSerpFilterName', [
        '$templateCache',
        function($templateCache){
            return {
                template: $templateCache.get('components/dynamic-serp-filter/name.html'),
                scope: {
                    hotels: '=dynamicSerpFilterNameHotels',
                    filters: '=dynamicSerpFilterNameFilters'
                },
                controller: [
                    '$scope', '$controller', '$element',
                    function($scope, $controller, $element){
                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*Models*/
                        var Option = inna.Models.Avia.Filters._OptionFactory(function(title){
                            this.value = '';

                            this.shown = true;
                        });

                        Option.prototype.reset = function(){
                            this.value = '';
                        };

                        var Options = inna.Models.Avia.Filters._OptionsFactory();

                        Options.prototype.hasSelected = function(){
                            return this.single.value != '';
                        };

                        Option.prototype.describe = function(){
                            return ['...', this.value.toLowerCase(), '...'].join('');
                        }

                        /*Properties*/
                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('Name'));
                        $scope.filter.filterFn = function(hotel){
                            if(!hotel.data.HotelName) return;

                            var val = this.options.single.value.toLowerCase();
                            var name = hotel.data.HotelName.toLowerCase();
                            var contains = (name.indexOf(val) !== -1);

                            if(!contains) hotel.hidden = true;
                        }
                        $scope.options = $scope.filter.options = new Options();
                        $scope.option = new Option('name');
                        $scope.options.push($scope.option);
                        $scope.options.single = $scope.option;

                        /*Methods*/
                        $scope.reset = function(){
                            $scope.option.reset();
                        }

                        /*Watchers*/
                        $scope.$watch('option.value', function(){
                            $scope.option.selected = ($scope.option.value !== '');
                        });
                    }
                ]
            }
        }
    ]);