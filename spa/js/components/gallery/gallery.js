angular.module('innaApp.components').
    factory('HotelGallery', [
        '$filter',
        '$templateCache',
        function ($filter, $templateCache) {

            /**
             * Компонент HotelGallery
             * @class
             */
            var HotelGallery = Ractive.extend({
                template: $templateCache.get('components/gallery/templ/gallery.hbs.html'),
                append: true,
                data: {
                    isHovered: false,
                    imageSize: 'MediumPhotos',
                    photoList: [],
                    photoCollection: [],
                    width: 200,
                    height: 190
                },


                onrender: function () {
                    var that = this;
                    this._sliderItemTotal = null;
                    this._slider = null;
                    this._sliderIndex = 0;
                    this._slider = this.find('.b-carousel__slider');


                    this.on({
                        slideNext: this.slideNext,
                        slidePrev: this.slidePrev,
                        hover: this.onHover,
                        teardown: function (evt) {
                            //console.log('teardown Gallery');
                        },
                        change: function (data) {

                        }
                    });

                    this.observe('PhotoHotel', function (newValue) {
                        var size = this.get('imageSize');

                        if (newValue && (newValue[size] && newValue[size].length)) {
                            var baseUrl = newValue.BaseUrl;
                            var photoList = newValue[size];
                            var joinPhoto = [];

                            for (var i = 0; i < photoList.length; i++) {
                                var img = photoList[i];
                                joinPhoto.push(baseUrl + img);
                            }


                            //клонируем массив - чтоб ractive не наблюдал за ним вверх по дочерним компонентам
                            this._sliderItemTotal = joinPhoto.length;
                            this.set('photoList', []);
                            this.set('photoList', [].concat(joinPhoto));
                        }
                    });
                },

                oncomplete: function (data) {
                    this._slider = this.find('.b-carousel__slider');
                    this._sliderItemTotal = this.get('photoList').length;
                },

                /**
                 * Animate
                 * @param index
                 */
                carouselSlide: function (index) {
                     $(this._slider).css({
                        left: "-" + (this._sliderIndex * this.get('width')) + "px"
                     });

                    // пока не получилось включить Css-3 анимацию
                    // происходит сглаживание и шрифт в блоке выглядит очень плохо

                    /*$(this._slider).css({
                        "-webkit-transform": "translate3d(-" + (this._sliderIndex * this.get('width')) + "px, 0px, 0px)",
                        "-moz-transform": "translate3d(-" + (this._sliderIndex * this.get('width')) + "px, 0px, 0px)",
                        "-ms-transform": "translate3d(-" + (this._sliderIndex * this.get('width')) + "px, 0px, 0px)",
                        "transform": "translate3d(-" + (this._sliderIndex * this.get('width')) + "px, 0px, 0px)"
                    });*/
                },


                /**
                 * Slide next
                 * @param evt
                 */
                slideNext: function (evt) {
                    this._sliderIndex += 1;
                    this._sliderIndex = ( this._sliderIndex > this._sliderItemTotal - 1) ? 0 : this._sliderIndex;
                    this.carouselSlide(this._sliderIndex);
                },


                /**
                 * Slide prev
                 * @param evt
                 */
                slidePrev: function (evt) {
                    this._sliderIndex -= 1;
                    this._sliderIndex = ( this._sliderIndex < 0) ? this._sliderItemTotal - 1 : this._sliderIndex;
                    this.carouselSlide(this._sliderIndex);
                },

                onHover: function () {

                    this.set({isHovered: true});
                    // отписываемся от события hover
                    this.off('hover');

                    // создаем новый массив исключая первый элемент
                    var newArrPhoto = this.get('photoList').splice(1, this.get('photoList').length);

                    this.set({photoCollection: newArrPhoto})
                },

                parse: function (end) {

                }

            });

            return HotelGallery;
        }]);


/**
 * Директива HotelGallery
 */
innaAppDirectives.directive('hotelGalleryDirective', [
    '$templateCache',
    '$timeout',
    'EventManager',
    '$filter',
    'HotelGallery',
    function ($templateCache, $timeout, EventManager, $filter, HotelGallery) {
        return {
            replace: true,
            template: '',
            scope: {
                isMap: '=',
                photoHotel: '=',
                width: '@',
                height: '@'
            },
            link: function ($scope, $element, $attr) {

                var el = $element[0];
                var templ = $templateCache.get('components/gallery/templ/gallery.map.hbs.html');
                var HotelGalleryComponent = null;

                // Переделать
                // Сейчас каждый раз когда нужно показать галлерею фотографий отеля на карте
                // старая уничтожается и создается новая
                // нужно просто делать обновление текущей галлерее
                $scope.$watch('photoHotel', function (value) {
                    if (value) {

                        if(HotelGalleryComponent){
                            HotelGalleryComponent.teardown();
                            HotelGalleryComponent = null;
                        }

                        HotelGalleryComponent = new HotelGallery({
                            el: el,
                            template: templ,
                            data: {
                                map: $scope.isMap,
                                PhotoHotel: value,
                                width: $scope.width,
                                height: $scope.height
                            }
                        })
                    }
                })


                $scope.$on('$destroy', function () {
                    if (HotelGalleryComponent) {
                        HotelGalleryComponent.teardown();
                        HotelGalleryComponent = null;
                    }
                })
            }
        }
    }])

