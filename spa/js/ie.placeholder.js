
(function($) {
    $(function() {

        $('input[placeholder]').each(function() {
            placeholderIE($(this));
        })
        .on('focus', function() {
            var t = $(this);
            if( t.attr('placeholder') == t.val() ) {
                t.val('');
            }
        })
        .on('blur', function() {
            var t = $(this);
            placeholderIE(t);
            if( t.hasClass('js-start-date') ) {
                placeholderIE($('.js-finish-date'));
            } else if( t.hasClass('js-finish-date') ) {
                placeholderIE($('.js-start-date'));
            }
        });

        function placeholderIE(el) {
            var placeholderValue = el.attr('placeholder');
            if(  el.val() == '' ) {
                el.val(placeholderValue);
            }
        }


    });
})(jQuery);