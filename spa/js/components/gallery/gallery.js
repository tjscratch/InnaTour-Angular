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
                    isHovered : false,
                    imageSize : 'SmallPhotos',
                    photoList: [],
                    photoCollection : [],
                    width: 200,
                    height: 190
                },

                init: function () {
                    var that = this;
                    this._sliderItemTotal = null;
                    this._slider = null;
                    this._sliderIndex = 0;


                    this.on({
                        slideNext : this.slideNext,
                        slidePrev : this.slidePrev,
                        hover : this.onHover,
                        teardown: function (evt) {
                            //console.log('teardown Gallery');
                        },
                        change: function (data) {

                        }
                    })


                    this.observe('PhotoHotel', function (newValue) {
                        if (newValue && (newValue.SmallPhotos && newValue.SmallPhotos.length)) {
                            var baseUrl = newValue.BaseUrl;
                            var photoList = newValue.SmallPhotos;
                            var joinPhoto = [];

                          for (var i = 0; i < photoList.length; i++) {
                            var img = photoList[i];
                            joinPhoto.push(baseUrl+img);
                          }


                            //клонируем массив - чтоб ractive не наблюдал за ним вверх по дочерним компонентам
                            this.set({ photoList : [].concat(joinPhoto)})
                        }
                    });
                },

                complete: function (data) {
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


                    /*_slider.css({
                     "-webkit-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                     "-moz-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                     "-ms-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                     "transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)"
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

                onHover : function(){

                   this.set({isHovered : true});
                    // отписываемся от события hover
                    this.off('hover');

                    // создаем новый массив исключая первый элемент
                    var newArrPhoto = this.get('photoList').splice(1, this.get('photoList').length);

                    this.set({photoCollection : newArrPhoto})
                },

                parse: function (end) {

                }

            });

            return HotelGallery;
        }]);

