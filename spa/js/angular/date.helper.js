var dateHelper = {
    apiDateToJsDate: function (dParam) {
        //"2014-01-31T20:45:00"
        if (dParam != null) {
            //разделяем дату и время
            var parts = dParam.split('T');
            if (parts.length == 2) {
                var sDate = parts[0];
                var sTime = parts[1];

                //дата
                var dParts = sDate.split('-');
                if (dParts.length == 3) {
                    //день
                    var d = parseInt(dParts[2], 10);
                    //месяц (в js месяцы начинаются с 0)
                    var m = parseInt(dParts[1], 10) - 1;
                    //год
                    var y = parseInt(dParts[0], 10);

                    //время
                    var tParts = sTime.split(':');
                    if (tParts.length == 3) {
                        var h = parseInt(tParts[0], 10);
                        var mm = parseInt(tParts[1], 10);
                        var ss = parseInt(tParts[2], 10);

                        var res = new Date(y, m, d, h, mm, ss);
                        return res;
                    }
                }
            }
        }

        return null;
    },

    dateToApiDate: function (date) {
        if (date != null) {
            var parts = date.split('.');
            var apiDate = parts[2] + '-' + parts[1] + '-' + parts[0];
            return apiDate;
        }
        else
            return null;
    },

    dateToSletatDate: function (date) {
        if (date != null) {
            var parts = date.split('.');
            var apiDate = parts[0] + '/' + parts[1] + '/' + parts[2];
            return apiDate;
        }
        else
            return null;
    },

    sletatDateToDate: function (date) {
        if (date != null) {
            var parts = date.split('/');
            var apiDate = parts[0] + '.' + parts[1] + '.' + parts[2];
            return apiDate;
        }
        else
            return null;
    },

    jsDateToDate: function (date) {
        function addZero(val) {
            if (val < 10)
                return '0' + val;
            return '' + val;
        };
        var curr_date = date.getDate();
        var curr_month = date.getMonth() + 1; //Months are zero based
        var curr_year = date.getFullYear();
        return (addZero(curr_date) + "." + addZero(curr_month) + "." + curr_year);
    },

    dateToJsDate: function (sDate) {//"25.03.2014"
        //дата
        var dParts = sDate.split('.');
        if (dParts.length == 3) {
            //день
            var d = parseInt(dParts[0], 10);
            //месяц (в js месяцы начинаются с 0)
            var m = parseInt(dParts[1], 10) - 1;
            //год
            var y = parseInt(dParts[2], 10);

            var res = new Date(y, m, d);
            return res;
        }
    },

    eof: null
};