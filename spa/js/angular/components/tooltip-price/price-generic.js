angular.module('innaApp.directives')
    .directive('tooltipPriceGeneric', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/tooltip-price/templ/price-generic.html'),
            scope: {
                "items" : "="
            },
            controller: [
                '$scope',
                '$element',
                'innaApp.API.events',
                function($scope, $element, Events){

                    var isVisible = false;

                    var getIsVisible = function () {
                        return isVisible;
                    }

                    var setIsVisible = function (data) {
                        isVisible = data;
                    }

                    var showToolTip = function (evt) {
                        evt.stopPropagation();

                        var tooltip = $element.find('.JS-tooltip-price');

                        $(document).on('tooltip:hide', function () {
                            setIsVisible(false);
                            tooltip.hide();
                        });

                        $(document).trigger('tooltip:hide');

                        if (!getIsVisible()) {
                            tooltip.show();
                            setIsVisible(true);
                        }
                        else {
                            tooltip.hide();
                            setIsVisible(false);
                        }

                        $(document).on('click', function bodyClick() {
                            tooltip.hide();
                            setIsVisible(false);
                            $(document).off('click', bodyClick);
                        });
                    };

                    $element.on('click', '.js-show-tooltip', showToolTip);
                }
            ]
        }
    }]);