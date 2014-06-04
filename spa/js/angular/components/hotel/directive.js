angular.module('innaApp.directives')
    .directive('innaHotel', [
        '$templateCache',
        '$timeout',
        function ($templateCache, $timeout) {
            return {
                template: $templateCache.get('components/hotel/templ/index.html'),
                //templateUrl: '/spa/js/angular/components/hotel/templ/index.html',
                scope: false,
                transclude: true,

                controller: [
                    '$scope',
                    '$element',
                    function ($scope, $element) {
                        $scope.goToMap = function(){
                            $scope.$emit('hotel:go-to-map', $scope.hotel);
                        }

                    }],
                link : function($scope, $element){
                    $scope.$watch('hotel.currentlyInvisible', function(isInvis){
                        if(!isInvis && $element.find('.b-carousel').length) {
                            $timeout(function(){

                                $element.find('.b-carousel').innaCarousel({
                                    photoList: $scope.hotel.data.Photos,
                                    style: {
                                        width: 200,
                                        height: 190
                                    }
                                });

                            }, 1);
                        }
                    });
                }
            }
    }]);