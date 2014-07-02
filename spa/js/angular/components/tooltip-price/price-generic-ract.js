angular.module('innaApp.conponents').
    factory('priceGenericRact', ['$templateCache', function ($templateCache) {
        var result = {};

        result.events = {
            showPopup: function (event) {
                var evt = event.original;
                var item = event.context;

                evt.stopPropagation();

                var $element = $(event.node);
                var $tooltip = $element.find('.JS-tooltip-price');

                $tooltip.show();

                $(document).on('click', function bodyClick() {
                    $tooltip.hide();
                    $(document).off('click', bodyClick);
                });
            }
        }

        result.component = Ractive.extend({
            el: 'avia_result_cont',
            template: $templateCache.get('components/tooltip-price-ract/templ/price-generic.html'),
            init: function () {
                this.on({
                    showPopup: function (event) {
                        result.events.showPopup(event);
                }
                })
            }
        });

        return result;
    }]);
