/**
 * Carousel
 * photo = массив фотографий
 * photoStyle = размер фотографии
 */
innaAppDirectives
    .directive('componentCarousel', [
        '$templateCache',
        function ($templateCache) {

            return {

                scope: {
                    photo: '=photoList',
                    photoStyle: '=photoStyle'
                },
                controller: [
                    '$scope',
                    '$element',
                    '$timeout',
                    function ($scope, $element, $timeout) {

                        $scope._options = {};

                        /**
                         * Настройки для карусели
                         * @type {*|Query|Cursor}
                         * @private
                         */

                        var $thisEl = $element[0];
                        var carouselHolder = $thisEl.querySelector('.b-carousel__holder');

                        var _slider = $thisEl.querySelector('.b-carousel__slider');
                        var _sliderItems = $thisEl.querySelectorAll('.b-carousel_item');
                        var _sliderItemTotal = $scope.photo.length;
                        var _sliderItemWidth = $scope.photoStyle.width;
                        var _sliderIndex = 0;
                        var _sliderSpeed = 500;

                        carouselHolder.style.width = _sliderItemWidth + 'px';
                        carouselHolder.style.height = $scope.photoStyle.height + 'px';
                        // ширина блока с контентом карусели
                        _slider.style.width = ((_sliderItemTotal * _sliderItemWidth) + 10) + 'px';
                        _slider.style.height = $scope.photoStyle.height + 'px';




                        $timeout(function(){
                            var _sliderItems = $thisEl.querySelectorAll('.b-carousel_item');
                            _sliderItems.forEach(function (slider) {
                                slider.style.width = $scope.photoStyle.width + 'px';
                                slider.style.height = $scope.photoStyle.height + 'px';
                            });
                        }, 1000);


                        carouselHolder.style.width = _sliderItemWidth;

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
                            var $this = $(evt.currentTarget);

                            _sliderIndex += 1;
                            _sliderIndex = ( _sliderIndex > _sliderItemTotal - 1) ? 0 : _sliderIndex
                            carouselSlide(_sliderIndex);
                        }


                        function slidePrev(evt) {
                            evt.preventDefault();
                            var $this = $(evt.currentTarget);

                            _sliderIndex -= 1;
                            _sliderIndex = ( _sliderIndex < 0) ? _sliderItemTotal - 1 : _sliderIndex
                            carouselSlide(_sliderIndex);
                        }
                    }
                ]
            };
        }])