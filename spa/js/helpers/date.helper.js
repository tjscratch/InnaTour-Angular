



var dateHelper = {
    apiDateToJsDate: function (dParam) {
        //"2014-01-31T20:45:00"
        if (dParam != null) {
            //разделяем дату и время
            var parts = dParam.split('T');
            if (parts.length >=1) {
                var sDate = parts[0];

                //дата
                var dParts = sDate.split('-');
                if (dParts.length == 3) {
                    //день
                    var d = parseInt(dParts[2], 10);
                    //месяц (в js месяцы начинаются с 0)
                    var m = parseInt(dParts[1], 10) - 1;
                    //год
                    var y = parseInt(dParts[0], 10);

                    if (parts.length == 2) {
                        var sTime = parts[1];

                        //время
                        var tParts = sTime.split(':');
                        if (tParts.length == 3) {
                            var h = parseInt(tParts[0], 10);
                            var mm = parseInt(tParts[1], 10);
                            var ss = parseInt(tParts[2], 10);

                            var res = new Date(y, m, d, h, mm, ss);
                            return res;
                        }
                        else {
                            return new Date(y, m, d);
                        }
                    }
                    else {
                        return new Date(y, m, d);
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

    jsDateToDate: function (date, noLeadingZero) {
        function addZero(val) {
            if (noLeadingZero){
                return '' + val;
            }

            if (val < 10)
                return '0' + val;
            return '' + val;
        }
        var curr_date = date.getDate();
        var curr_month = date.getMonth() + 1; //Months are zero based
        var curr_year = date.getFullYear();
        return (addZero(curr_date) + "." + addZero(curr_month) + "." + curr_year);
    },

    dateToJsDate: function (sDate) {
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

    getTimeSpanFromMilliseconds: function (ms) {
        var x = ms / 1000;
        var seconds = Math.floor(x % 60);
        x /= 60;
        var minutes = Math.floor(x % 60);
        x /= 60;
        var hours = Math.floor(x % 24);
        x /= 24;
        var days = Math.floor(x);
        x /= 365;
        var years = Math.floor(x);
        return { seconds: seconds, minutes: minutes, hours: hours, days: days, years: years };
    },

    getTimeSpanMaxDays: function (ts) {
        var days = ts.days;
        if (ts.hours > 0 || ts.minutes > 0 || ts.seconds > 0)
            days++;
        return days;
    },

    getTodayDate: function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        return new Date(yyyy, mm, dd);
    },

    calculateAge: function (birthday, now) {
        if (now == undefined) {
            now = new Date();
        }

        var years = now.getFullYear() - birthday.getFullYear();

        var now_m = now.getMonth();
        var now_d = now.getDate();
        var b_m = birthday.getMonth();
        var b_d = birthday.getDate();

        //дата вылета - июль(6 мес), дата рождения - июнь (5 мес)
        if (b_m > now_m) {
            years--;
        }
        else if (b_m == now_m && b_d > now_d) {
            years--;
        }

        return years;
    },

    ddmmyyyy2yyyymmdd: function (ddmmyy) {
        function trailingZero(n) {
            return n >= 10 ? n : ('0' + n);
        }

        var date = Date.fromDDMMYY(ddmmyy);

        return [date.getFullYear(), trailingZero(date.getMonth() + 1), trailingZero(date.getDate())].join('-');
    },

    isHoursBetween: function (date) {
        var start, end;

        if (!(date instanceof Date)) {
            date = dateHelper.apiDateToJsDate(date);
        }

        if (arguments[1] instanceof Array) {
            start = arguments[1][0];
            end = arguments[1][1];
        } else {
            start = arguments[1];
            end = arguments[0];
        }

        var h = date.getHours();

        return start < end ? (h >= start && h < end) : (h >= start || h < end);
    },

    translateMonth: function (n) {
        return [
            'января', 'февраля', 'марта',
            'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября',
            'октября', 'ноября', 'декабря'
        ][n]
    },

    translateMonthEn: function (n) {
        return ["January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"][n]
    },

    translateMonthShort: function (n) {
        return [
            'янв', 'фев', 'мар',
            'апр', 'мая', 'июн',
            'июл', 'авг', 'сен',
            'окт', 'ноя', 'дек'
        ][n]
    },

    translateMonthShortEn: function (n) {
        return ["Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "Jul", "Aug", "Sep",
            "Oct", "Nov", "Dec"][n]
    },

    translateDay: function (n) {
        return ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][n]
    },

    translateDayEn: function (n) {
        return ["Monday","Tuesday","Wednesday","Thursday","Friday	","Saturday","Sunday"][n];
    },

    translateDayShortEn: function (n) {
        return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][n];
    },

    getTime: function (date) {
        return [date.getHours(), date.getMinutes()].map(function (val) {
            if (val % 10 == val) return '' + '0' + val;

            return val;
        }).join(':');
    },

    getDateShort: function (date) {
        return [date.getDate(), dateHelper.translateMonth(date.getMonth())].join(' ');
    },

    getDay: function (date) {
        return dateHelper.translateDay(date.getDay());
    },

    eof: null
};

Date.fromDDMMYY = function (ddmmyy, asTS) {
    if (ddmmyy) {
        var bits = ddmmyy.split('.');
        var mmddyy = [+bits[1], +bits[0], +bits[2]].join('.');
        //var date = new Date(mmddyy);//в IE invalid date
        var date = new Date(+bits[2], (+bits[1] - 1), +bits[0]);


        if (asTS) return +date;


        return date;
    } else {
        return '';
    }
};