(function ($) {

    var methods = {
        init : function( options ) {

        },
        destroy : function( ) {

        },
        reposition : function( ) {

        },
        show : function( ) {

        },
        hide : function( ) {

        },
        update : function( content ) {

        }
    };



    $.fn.innaCarousel = function (options) {


        /** Settings */
        var settings = $.extend({
            'photoList': [],
            'style': {}
        }, options);


        var imageSize = settings.size || 'Large';
        var _holder = this.find('.b-carousel__holder');
        var _slider = this.find('.b-carousel__slider');
        var _sliderItemTotal = settings.photoList.length;
        var _sliderItemWidth = settings.style.width;
        var _sliderIndex = 0;
        var _itemTemplate = function (image_path) {
            var templ = '<div class="b-carousel_item b-carousel_map_item">' +
                '<div class="b-carousel_map_item_image" style="background-image: url(' + image_path + ');"></div>' +
                '</div>';

            return templ;
        };
        var fragment = document.createDocumentFragment();

        settings.photoList.forEach(function(photo){
            if(photo) {
                var templ = _itemTemplate(photo[imageSize]);
                fragment.appendChild($(templ)[0]);
            }
        });

        _slider[0].appendChild(fragment);

        _holder.css({
            width : settings.style.width + 'px',
            height : settings.style.height +'px'
        });
        _slider.css({
            width : (settings.photoList.length * settings.style.width + 10) + 'px',
            height : settings.style.height +'px'
        });

        // количество фотографий
        this.find('.hotel-gallery-photo-button').html(settings.photoList.length);



        this.on('click', '.b-carousel__next', slideNext);
        this.on('click', '.b-carousel__prev', slidePrev);


        /**
         * Animate
         * @param index
         */
        var carouselSlide = function (index) {
            _slider.css({
                "-webkit-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                "-moz-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                "-ms-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                "transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)"
            });
        }


        /**
         * Slide next
         * @param evt
         */
        function slideNext  (evt) {
            evt.preventDefault();

            _sliderIndex += 1;
            _sliderIndex = ( _sliderIndex > _sliderItemTotal - 1) ? 0 : _sliderIndex
            carouselSlide(_sliderIndex);
        }


        /**
         * Slide prev
         * @param evt
         */
        function slidePrev(evt) {
            evt.preventDefault();

            _sliderIndex -= 1;
            _sliderIndex = ( _sliderIndex < 0) ? _sliderItemTotal - 1 : _sliderIndex
            carouselSlide(_sliderIndex);
        }

    };
})(jQuery);
