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
    directive('datePickerCustom', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var minDate = new Date();
                minDate.setDate(minDate.getDate());

                var ngModel = $parse(attrs.ngModel);
                //чекбокс
                var ngModelCheck = $parse(attrs.ngModelCheck);
                var isDateChecked = scope.$eval(attrs.ngModelCheck);

                //клики по форме пикера гасим, чтобы не срабатывал клик по body
                element.datepicker("widget").on("click", function (event) {
                    event.stopPropagation();
                });

                element.datepicker({
                    minDate: minDate,
                    onSelect: function (dateText) {
                        scope.$apply(function (scope) {
                            // Change binded variable
                            ngModel.assign(scope, dateText);
                        });
                    },
                    afterShow: function () {
                        var cont = element.datepicker("widget");
                        //рендер плашки
                        cont.prepend("<div class='calendar-head'><span class='caption'>Дата вылета</span><div class='check-container'><span class='checkbox'></span><label class='checkbox-label'>+/- 5 дней</label></div></div>");
                        updateCheck();

                        $(".check-container", cont).on("click", function (event) {
                            event.stopPropagation();
                            //клик по чекбоксу
                            var isDateChecked = scope.$eval(attrs.ngModelCheck);
                            isDateChecked = !isDateChecked;

                            scope.$apply(function (scope) {
                                ngModelCheck.assign(scope, isDateChecked);
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
                    var isDateChecked = scope.$eval(attrs.ngModelCheck);
                    var cont = element.datepicker("widget");
                    //console.log('updateCheck: ' + isDateChecked);
                    if (isDateChecked)
                        $(".checkbox", cont).addClass("checked");
                    else
                        $(".checkbox", cont).removeClass("checked");
                }

                //ловим изменение флага
                scope.$watch(attrs.ngModelCheck, function (value) {
                    updateCheck();
                });
            }
        };
    }]);