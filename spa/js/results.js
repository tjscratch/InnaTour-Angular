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
            console.log(winPos, filterPos.top);
            winPos = parseInt(winPos + 100);
            if( winPos > filterPos.top ) {
                filter.addClass(filterFixed);
            } else {
                filter.removeClass(filterFixed);
            }
        }
        filterPosition();
        $(window).on('scroll', function() {
            filterPosition();
        });

    });
})(jQuery);