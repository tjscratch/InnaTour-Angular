(function($) {
    $(function() {

        // Trackbar
        $('.js-trackbar-price').slider({
            range: true,
            min: 0,
            max: 59222,
            values: [ 8000, 51222 ],
            slide: function( event, ui ) {
                $( ".js-amount-price" ).html("От "+ui.values[0]+" р. до "+ui.values[ 1 ]+" р.");
            }
        });
        $( ".js-amount-price" ).text("От " + $( ".js-trackbar-price" ).slider( "values", 0 ) + " р. до " + $( ".js-trackbar-price" ).slider( "values", 1 ) + " р.");
        $('.js-trackbar-arrive').slider({
            range: true,
            min: 0,
            max: 1440,
            values: [ 75, 1222 ],
            slide: function( event, ui ) {
                $( ".js-amount-arrive" ).html("Вылет: Петропавловск-Камчатский<br>Пт " +valToTime(ui.values[0])+ " - " +valToTime(ui.values[1]));
            }
        });
        $( ".js-amount-arrive" ).html("Вылет: Петропавловск-Камчатский<br>Пт " +valToTime($( ".js-trackbar-arrive" ).slider( "values", 0 ))+ " - " + valToTime($( ".js-trackbar-arrive" ).slider( "values", 1 )));
        $('.js-trackbar-depart').slider({
            range: true,
            min: 0,
            max: 1440,
            values: [ 75, 1222 ],
            slide: function( event, ui ) {
                $( ".js-amount-depart" ).html("Вылет: Москва<br>Пт " +valToTime(ui.values[0])+ " - " +valToTime(ui.values[1]));
            }
        });
        $('.js-range').slider({
            range: "min",
            min: 0,
            max: 144000,
            value: 12700,
            slide: function( event, ui ) {
                $( ".js-range-val" ).val(ui.value);
            }
        });
        $( ".js-amount-depart" ).html("Вылет: Москва<br>Пт " + valToTime($( ".js-trackbar-depart" ).slider( "values", 0 )) + " - " + valToTime($( ".js-trackbar-depart" ).slider( "values", 1 )));
        function valToTime(v) {
            var hours = [], 
                minutes = [];
            for(var i = 0; i < 2; i++) {
                hours[i] = Math.floor(v / 60);
                minutes[i] = v - (hours[i] * 60);
                var hValue = String(hours[i]);
                var mValue = String(minutes[i]);
                if(hValue.length == 1) {
                    hours[i] = '0' + hours[i];
                }
                if(mValue.length == 1) {
                    minutes[i] = '0' + minutes[i];
                }
                v = hours[0]+':'+minutes[0];
                return v;
            }
        }

    });
})(jQuery);