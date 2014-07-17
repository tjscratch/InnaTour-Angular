(function ($) {

    var methods = {
        init: function (options) {

        },
        destroy: function () {

        },
        reposition: function () {

        },
        show: function () {

        },
        hide: function () {

        },
        update: function (content) {

        }
    };


    $(function () {
        $(document).on('click', '.tooltip-widget', function (evt) {
            var $this = $(evt.currentTarget);

            $this.find('.tooltip').tooltipWidget({
                settings: $this.data('settings'),
                elementRect : $this.find('.tooltip__icon'),
                positionRect : utils.getCoords($this.find('.tooltip__icon')[0]),
                tooltipElement : $this.find('.tooltip')
            });
        })
    });

    $.fn.tooltipWidget = function (options) {

        /** Settings */
        var settings = $.extend({
            'photoList': [],
            'style': {}
        }, options);

        var tooltipW = settings.tooltipElement.width()

        // позиционируем tooltip
        //console.log(settings.tooltipElement.width());
        settings.tooltipElement.css(settings.settings.position, '-' + settings.tooltipElement.width());

    };
})(jQuery);
