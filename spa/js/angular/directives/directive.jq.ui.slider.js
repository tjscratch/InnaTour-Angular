﻿
'use strict';

/* Directives */

innaAppDirectives.
    directive('jqUiSlider', ['$parse', function ($parse) {
        return {
            require: 'ngModel',
            scope: {
                initMinValue: '=',
                initMaxValue: '=',
                minValue: '=',
                maxValue: '='
            },
            link: function (scope, element, attrs, ngModel) {

                $(element).slider({
                    range: true,
                    min: scope.initMinValue,
                    max: scope.initMaxValue,
                    values: [scope.minValue, scope.maxValue],
                    slide: function (event, ui) {
                        scope.$apply(function (scope) {
                            scope.minValue = ui.values[0];
                            scope.maxValue = ui.values[1];
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
                            min: scope.initMinValue,
                            max: scope.initMaxValue,
                            values: [scope.minValue, scope.maxValue]
                        });
                };

                //мониторим изменения filter
                scope.$watch(function () { return ngModel.$modelValue; }, function (filter) {
                    applyWatchThrottled(filter);
                }, true);
            }
        };
    }]);