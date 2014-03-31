﻿
'use strict';

/* Directives */

innaAppDirectives.
    directive('priceSlider', ['$parse', function ($parse) {
        return {
            link: function (scope, element, attrs) {

                $(element).slider({
                    range: true,
                    min: 0,
                    max: 10,
                    values: [0, 10],
                    slide: function (event, ui) {
                        scope.$apply(function (scope) {
                            scope.filter.minPrice = ui.values[0];
                            scope.filter.maxPrice = ui.values[1];
                        });
                    }
                });

                //обновляем раз в 100мс
                var applyWatchThrottled = _.debounce(function (filter) {
                    applyWatchDelayed(filter);
                }, 100);

                var applyWatchDelayed = function (filter) {
                    //console.log('slider option change');
                    $(element).slider("option",
                        {
                            min: filter.minPriceInitial,
                            max: filter.maxPriceInitial,
                            values: [filter.minPrice, filter.maxPrice]
                        });
                };

                //мониторим изменения filter
                scope.$watch("filter", function (filter) {
                    applyWatchThrottled(filter);
                }, true);
            }
        };
    }]);