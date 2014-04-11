angular.module('innaApp.directives')
    .directive('dynamicSerpFilterCategory', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/category.html',
                scope: {
                    hotels: '='
                },
                controller: [
                    '$scope',
                    function($scope){
                        $scope.options = {};

                        $scope.$watchCollection('hotels', function(newVal){
                            _.each(newVal, function(hotel){
                                if (hotel.Stars in $scope.options) {
                                    $scope.options[hotel.Stars]++;
                                } else {
                                    $scope.options[hotel.Stars] = 1;
                                }
                            });
                        });

                        $scope.setStars = function(stars){
                            console.log(stars);
                            $scope.$emit('inna.Dynamic.SERP.Hotel.Filter', {filter: 'Stars', value: stars});
                        }
                    }
                ]
            }
        }
    ]);