﻿
'use strict';

/* Directives */

innaAppDirectives.
    directive('datePickerTwoMonths', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModelCtrl) {
                //добавляем событие afterShow к datepicker
                element.datepicker._updateDatepicker_original = element.datepicker._updateDatepicker;
                element.datepicker._updateDatepicker = function (inst) {
                    element.datepicker._updateDatepicker_original(inst);
                    var afterShow = this._get(inst, 'afterShow');
                    if (afterShow)
                        afterShow.apply((inst.input ? inst.input[0] : null));  // trigger custom callback
                }

                var minDate = new Date();
                minDate.setDate(minDate.getDate());

                var ngModel = $parse(attrs.ngModel);
                element.datepicker({
                    //minDate: minDate,
                    //onSelect: function (dateText) {
                    //    scope.$apply(function (scope) {
                    //        // Change binded variable
                    //        ngModel.assign(scope, dateText);
                    //    });
                    //}
                    defaultDate: "+1w",
                    numberOfMonths: 2,
                    minDate: 0,
                    dateFormat: 'd M, D',
                    onClose: function(selectedDate) {
                        $('.js-finish-date').datepicker( "option", "minDate", selectedDate );
                    },
                    afterShow: function(input, inst) {
                        var dp = $('.ui-datepicker');
                        dp.appendTo(element.parent());
                        dp.prepend('<div class="dtpk-head"><span class="dtpk-caption">Дата вылета</span><label class="dtpk-checkbox-label"><input type="checkbox" /><span class="dtpk-checkbox"></span>+/- 5 дней</label></div>');
                    }
                });

                $(window).resize(function () {
                    element.datepicker('hide');
                    $('.Calendar-input').blur();
                });
            }
        };
    }]);