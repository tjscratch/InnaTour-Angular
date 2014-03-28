﻿
'use strict';

/* Directives */

// Datepicker
if ($.datepicker._updateDatepicker_original == null) {
    $.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;
    $.datepicker._updateDatepicker = function (inst) {
        $.datepicker._updateDatepicker_original(inst);
        var afterShow = this._get(inst, 'afterShow');
        if (afterShow)
            afterShow.apply((inst.input ? inst.input[0] : null));
    }
}

innaAppDirectives.
    directive('datePickerTwoMonths', ['$parse', '$rootScope', function ($parse, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                //клики по форме пикера гасим, чтобы не срабатывал клик по body
                element.datepicker("widget").on("click", function (event) {
                    event.stopPropagation();
                });

                var ngModel = $parse(attrs.ngModel);
                //чекбокс
                var ngCheckModel = $parse(attrs.ngCheckModel);

                //отпределяем from или to контрол
                var ngModelFrom = scope.$eval(attrs.ngModelFrom);
                var ngModelTo = scope.$eval(attrs.ngModelTo);
                //console.log('ngModelFrom: ' + ngModelFrom + '; ngModelTo: ' + ngModelTo);

                element.datepicker({
                    onSelect: function (dateText) {
                        scope.$apply(function (scope) {
                            // Change binded variable
                            ngModel.assign(scope, dateText);
                            //уведмляем dateTo контрол о выборе в первом контроле
                            if (ngModelFrom == true)
                                scope.$broadcast("date.from.close", dateText);
                        });
                    },
                    defaultDate: "+1w",
                    numberOfMonths: 2,
                    minDate: 0,
                    dateFormat: 'dd.mm.yy',
                    onClose: function(selectedDate) {
                        
                    },
                    afterShow: function (input, inst) {

                        var dp = $('.ui-datepicker');
                        dp.appendTo(element.parent());
                        dp.prepend('<div class="dtpk-head"><span class="dtpk-caption">Дата вылета</span><label class="dtpk-checkbox-label"><input type="checkbox" /><span class="dtpk-checkbox"></span>+/- 5 дней</label></div>');
                        updateCheck();

                        $(":checkbox", dp).on("click", function (event) {
                            event.stopPropagation();
                            //клик по чекбоксу
                            var isDateChecked = scope.$eval(attrs.ngCheckModel);
                            isDateChecked = (isDateChecked == 0 ? 1 : 0);

                            scope.$apply(function (scope) {
                                ngCheckModel.assign(scope, isDateChecked);
                            });
                        });
                    }
                });

                $(window).resize(function () {
                    element.datepicker('hide');
                    $('.Calendar-input').blur();
                });

                function updateCheck() {
                    //обновляем checkbox
                    var isDateChecked = scope.$eval(attrs.ngCheckModel);
                    var dp = $('.ui-datepicker');
                    //console.log('updateCheck: ' + isDateChecked);
                    if (isDateChecked)
                        $(":checkbox", dp).prop('checked', true);
                    else
                        $(":checkbox", dp).prop('checked', false);
                }

                //ловим изменение флага
                scope.$watch(attrs.ngCheckModel, function (value) {
                    updateCheck();
                });

                if (ngModelTo == true) {
                    scope.$on('date.from.close', function (event, args) {
                        //console.log('date.from.close params: ' + angular.toJson(args));
                        $(element).datepicker("option", "minDate", args);
                    });
                }
            }
        };
    }]);