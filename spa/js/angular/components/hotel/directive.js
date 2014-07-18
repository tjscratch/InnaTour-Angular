(function(){
    function _activateGallery(elem){
        elem.on('mouseenter', function activateGallery(){
            var elem = $(this);

            elem.innaCarousel({
                photoList: elem.data('photos'),
                size: 'Small',
                style: {
                    width: 200,
                    height: 190
                }
            });

            elem.off('mouseenter', activateGallery);
        });
    }

    angular.module('innaApp.directives')
        .directive('innaHotel', [
            '$templateCache',
            '$timeout',
            'Tripadvisor',
            function ($templateCache, $timeout, Tripadvisor) {
                return {
                    template: $templateCache.get('components/hotel/templ/index.html'),
                    scope: false,
                    transclude: true,
                    controller: [
                        '$scope',
                        '$element',
                        'innaApp.API.events',
                        function ($scope, $element, Events) {
                            $scope.virtualBundle = new inna.Models.Dynamic.Combination();
                            $scope.virtualBundle.hotel = $scope.hotel;
                            $scope.virtualBundle.ticket = $scope.combination.ticket;

                            // Tripadvisor
                            var _tripadvisor = new Tripadvisor({
                                el : $element.find('.js-tripadvisor-container'),
                                data : {
                                    TaCommentCount: $scope.hotel.data.TaCommentCount,
                                    TaFactor: $scope.hotel.data.TaFactor,
                                    TaFactorCeiled: $scope.hotel.data.TaFactorCeiled
                                }
                            })

                            $scope.goToMap = function () {
                                $scope.$emit('hotel:go-to-map', $scope.hotel);
                            }

                            $scope.setCurrent = function () {
                                $scope.$emit(Events.DYNAMIC_SERP_CHOOSE_HOTEL, $scope.hotel);
                            }

                            $element.on('click', '.js-hotel-item-details', function (evt) {
                                $scope.$emit('more:detail:hotel', $scope.hotel);
                            });

                            $element.on('click', '.js-hotel-info-place', function (evt) {
                                $scope.$emit('hotel:go-to-map', $scope.hotel);
                            });


                            $scope.$on('$destroy', function(){
                                _tripadvisor.teardown();
                                _tripadvisor = null;
                            })
                        }],
                    link: function ($scope, $element) {
                        $scope.$watch('hotel.currentlyInvisible', function (isInvis) {
                            if (!isInvis) {
                                var galleryNode = $element.find('.b-carousel');

                                if(galleryNode.length) {
                                    galleryNode.data('photos', $scope.hotel.data.Photos);
                                    _activateGallery(galleryNode);
                                }
                            }
                        });
                    }
                }
            }]);
})();