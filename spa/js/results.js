(function($) {
    $(function() {

        $('.js-title').tooltip({
            position: {
                my: "center top",
            }
        });

        $('.js-overlay').on('click', function() {
            $(this).fadeOut(200);
        });

        $('.balloon').on('click', function(e) {
            e.stopPropagation();
        });

        function filterPosition() {
            var filter = $('.js-filter-scroll');
            var filterFixed = 'filters__container_fixed';
            var winPos = $(window).scrollTop();
            var filterPos = filter.parent().offset();
            winPos = parseInt(winPos + 100);
            if( winPos > filterPos.top ) {
                filter.addClass(filterFixed);
            } else {
                filter.removeClass(filterFixed);
            }
        }
        function tagsPosition() {
            var el = $('.js-tags-container');
            var fixedClass = 'ra-tags-container_fixed';
            var h = el.parent().offset();
            var w = $(window).scrollTop();
            w = parseInt(w + 150);
            console.log(h.top, w);
            if(h.top < w) {
                el.addClass(fixedClass);
            } else {
                el.removeClass(fixedClass);
            }
        }
        tagsPosition();
        filterPosition();
        $(window).on('scroll', function() {
            filterPosition();
            tagsPosition();
        });

        

        $(document).on('keydown', function (event) {
            if (event.which == 27) {
                $('.search-autocomplete, .js-datepicker, .search__list, .search-people-baloon, .filters__baloon').fadeOut(200);
            }
        });

    });
})(jQuery);