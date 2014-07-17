angular.module('innaApp.conponents').
    factory('HotelGallery', [
        '$filter',
        '$templateCache',
        function ($filter, $templateCache) {

            var HotelGallery = Ractive.extend({
                template: $templateCache.get('components/hotel-gallery/templ/gallery.hbs.html'),
                append: true,
                data: {
                    imageSize : 'Small',
                    photoList: [],
                    width: 200,
                    height: 190
                },
                partials : {
                    photoListTemplates : '<div>galary</div>'
                },
                init: function () {
                    var that = this;
                    that._sliderItemTotal = null;
                    this._slider = null;
                    that._sliderIndex = 0;

                    this.on({
                        change: function (data) {

                        },
                        slideNext : this.slideNext,
                        slidePrev : this.slidePrev,
                        hover : this.onHover,
                        teardown: function (evt) {

                        }
                    })

                   /* this.observe('photoList', function (newValue, oldValue, keypath) {
                        if (newValue) {

                        }
                    });*/
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
                    //

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
                   console.log('hover');
                },

                parse: function (end) {

                }

            });

            return HotelGallery;
        }]);

