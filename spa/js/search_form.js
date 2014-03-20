
(function($) {
    $(function() {

        // Datepicker
        $.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;
        $.datepicker._updateDatepicker = function (inst) {
            $.datepicker._updateDatepicker_original(inst);
            var afterShow = this._get(inst, 'afterShow');
            if (afterShow)
                afterShow.apply((inst.input ? inst.input[0] : null));
        }
        $.datepicker.setDefaults( $.datepicker.regional[ "ru" ] );
        $('.js-start-date').datepicker({
            defaultDate: "+1w",
            numberOfMonths: 2,
            minDate: 0,
            dateFormat: 'd M, D',
            onClose: function(selectedDate) {
                $('.js-finish-date').datepicker( "option", "minDate", selectedDate );
            },
            afterShow: function(input, inst) {
                var dp = $('.ui-datepicker');
                dp.appendTo('.js-start-date-block');
                dp.prepend('<div class="dtpk-head"><span class="dtpk-caption">Дата вылета</span><label class="dtpk-checkbox-label"><input type="checkbox" /><span class="dtpk-checkbox"></span>+/- 5 дней</label></div>');
            }
        });
        $('.js-finish-date').datepicker({
            defaultDate: "+1w",
            numberOfMonths: 2,
            minDate: 0,
            dateFormat: 'd M, D',
            onClose: function(selectedDate) {
                $('.js-start-date').datepicker( "option", "maxDate", selectedDate );
            },
            afterShow: function(input, inst) {
                var dp = $('.ui-datepicker');
                dp.appendTo('.js-finish-date-block');
                dp.prepend('<div class="dtpk-head"><span class="dtpk-caption">Дата вылета</span></div>');
            }
        });

        // People
        $('.js-people-minus').on('click', function() {
            var field = $(this).parent().find('.js-people-field');
            var val = field.val();
            if(val>0) {
                val = parseInt(val) - 1;
                field.val(val);
            }
        });
        $('.js-people-plus').on('click', function() {
            var field = $(this).parent().find('.js-people-field');
            var val = field.val();
            if(val<6) {
                val = parseInt(val) + 1;
                field.val(val);
            }
        });
        var peopleValue;
        $('.js-people-field').on('keypress', function(event) {
            var start = false,
                keys = [8, 9, 13, 27, 37, 38, 39, 40],
                theEvent = event || window.event,
                key = theEvent.keyCode || theEvent.which;
            for(var i=0;i<keys.length;i++) {
                if(keys[i] == key) {
                    start = true;
                }
            }
            key = String.fromCharCode( key );
            var regex = /[0-6]|\./;
            if((!regex.test(key)) && (start != true)) {
                theEvent.returnValue = false;
                if(theEvent.preventDefault) theEvent.preventDefault();
            }
        })
        .on('focus', function() {
            peopleValue = $(this).val();
        })
        .on('blur', function() {
            if($(this).val() == '') {
                $(this).val(peopleValue);
            }
        });

    });
})(jQuery);