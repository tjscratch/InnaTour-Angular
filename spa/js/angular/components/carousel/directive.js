/**
 * Carousel
 * photos = массив фотографий
 * photoStyle = размер фотографии
 */
innaAppDirectives
    .directive('componentCarousel', [
        '$templateCache',
        function ($templateCache) {

            return {
                template: function(element, attr){
                    var templatePath = 'components/carousel/templ/';
                    var templateName = attr.templateName || 'index.html';
                    return $templateCache.get(templatePath + templateName);
                },
                replace : true,
                scope: {
                    photos: '=photoList',
                    photoStyle: '=photoStyle'
                },
                controller: [
                    '$scope',
                    '$element',
                    '$timeout',
                    function ($scope, $element, $timeout) {

                        /**
                         * Настройки для карусели
                         * @type {*|Query|Cursor}
                         * @private
                         */

                        var $thisEl = $element[0];
                        var _slider = $thisEl.querySelector('.b-carousel__slider');
                        var _sliderItemTotal = $scope.photos.length;
                        var _sliderItemWidth = $scope.photoStyle.width;
                        var _sliderIndex = 0;

                        $element.on('click', '.b-carousel__next', slideNext);
                        $element.on('click', '.b-carousel__prev', slidePrev);

                        /**
                         * анимация карусели
                         * @param index
                         */
                        var carouselSlide = function (index) {
                            /*angular.element(_slider).stop().animate({
                             left: '-' + (_sliderIndex * _sliderItemWidth) + 'px'
                             }, _sliderSpeed);*/
                            angular.element(_slider).css({
                                "-webkit-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                                "-moz-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                                "-ms-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                                "transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)"
                            });
                        }

                        function slideNext(evt) {
                            evt.preventDefault();

                            _sliderIndex += 1;
                            _sliderIndex = ( _sliderIndex > _sliderItemTotal - 1) ? 0 : _sliderIndex
                            carouselSlide(_sliderIndex);
                        }


                        function slidePrev(evt) {
                            evt.preventDefault();

                            _sliderIndex -= 1;
                            _sliderIndex = ( _sliderIndex < 0) ? _sliderItemTotal - 1 : _sliderIndex
                            carouselSlide(_sliderIndex);
                        }
                    }
                ],
                link: function( $scope, $element ) {
                    setTimeout(function() {
                        $scope.$destroy();
                        $element.removeClass('ng-binding ng-scope');
                    }, 0);
                }
            };
        }])