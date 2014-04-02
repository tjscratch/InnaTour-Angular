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

    });
})(jQuery);