innaAppServices.
    factory('aviaHelper', ['$rootScope', '$http', '$log', '$filter', '$timeout', '$location', 'innaApp.Urls',
        function ($rootScope, $http, $log, $filter, $timeout, $location, Urls) {
        function log(msg) {
            $log.log(msg);
        }

        var manyCode = "any";
        var manyName = "any";

        var timeFormat = "HH:mm";
        var dateFormat = "dd MMM yyyy, EEE";
        var shortDateFormat = "dd MMM, EEE";

        function dateToMillisecs(date) {
            var res = dateHelper.apiDateToJsDate(date);
            if (res != null)
                return res.getTime();
            else
                return null;
        };

        function getTimeFormat(dateText) {
            return $filter("date")(dateText, timeFormat);
        }

        function getDateFormat(dateText, customDateFormat, useShort) {
            if (customDateFormat == null) {
                customDateFormat = useShort ? shortDateFormat : dateFormat;
            }
            return changeEnToRu($filter("date")(dateText, customDateFormat), useShort);
        }

        //формат дат
        var monthEnToRus = [
            { En: "Jan", Ru: "января" },
            { En: "Feb", Ru: "февраля" },
            { En: "Mar", Ru: "марта" },
            { En: "Apr", Ru: "апреля" },
            { En: "May", Ru: "мая" },
            { En: "Jun", Ru: "июня" },
            { En: "Jul", Ru: "июля" },
            { En: "Aug", Ru: "августа" },
            { En: "Sep", Ru: "сентября" },
            { En: "Oct", Ru: "октября" },
            { En: "Nov", Ru: "ноября" },
            { En: "Dec", Ru: "декабря" }];

        var monthEnToRusShort = [
            { En: "Jan", Ru: "янв" },
            { En: "Feb", Ru: "фев" },
            { En: "Mar", Ru: "мар" },
            { En: "Apr", Ru: "апр" },
            { En: "May", Ru: "мая" },
            { En: "Jun", Ru: "июн" },
            { En: "Jul", Ru: "июл" },
            { En: "Aug", Ru: "авг" },
            { En: "Sep", Ru: "сен" },
            { En: "Oct", Ru: "окт" },
            { En: "Nov", Ru: "ноя" },
            { En: "Dec", Ru: "дек" }];

        var weekDaysEnToRus = [
            { En: "Mon", Ru: "пн" },
            { En: "Tue", Ru: "вт" },
            { En: "Wed", Ru: "ср" },
            { En: "Thu", Ru: "чт" },
            { En: "Fri", Ru: "пт" },
            { En: "Sat", Ru: "сб" },
            { En: "Sun", Ru: "вс" }];

        function changeEnToRu(text, useShort) {
            if (text == null || text.length == 0)
                return text;

            var dic = useShort ? monthEnToRusShort : monthEnToRus;
            for (var i = 0; i < dic.length; i++) {
                var dicItem = dic[i];
                if (text.indexOf(dicItem.En) > -1) {
                    text = text.replace(dicItem.En, dicItem.Ru);
                    break;
                }
            }
            dic = weekDaysEnToRus;
            for (var i = 0; i < dic.length; i++) {
                var dicItem = dic[i];
                if (text.indexOf(dicItem.En) > -1) {
                    text = text.replace(dicItem.En, dicItem.Ru);
                    break;
                }
            }
            return text;
        }

        //время в пути
        function getFlightTimeFormatted(time) {
            if (time != null) {
                //вычисляем сколько полных часов
                var h = Math.floor(time / 60);
                var addMins = time - h * 60;
                //return h + " ч " + addMins + " мин" + " (" + time + ")";//debug
                if (addMins == 0)
                    return h + " ч";
                else
                    return h + " ч " + addMins + " мин";
            }
            return "";
        }

        function pluralForm(i, str1, str2, str3) {
            function plural(a) {
                if (a % 10 == 1 && a % 100 != 11) return 0
                else if (a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20)) return 1
                else return 2;
            }

            switch (plural(i)) {
                case 0: return str1;
                case 1: return str2;
                default: return str3;
            }
        }
        
        var baloonType = {
            msg: 'msg',
            err: 'err',
            msgClose: 'msgClose',
            success: 'success'
        };

        var helper = {
            sexType: { man: 1, woman: 2 },

            directionType: { departure: 'departure', arrival: 'arrival', backDeparture: 'backDeparture', backArrival: 'backArrival' },
            dayTime: { morning: 'morning', day: 'day', evening: 'evening', night: 'night' },

            cabinClassList: [{ name: 'Эконом', value: 0 }, { name: 'Бизнес', value: 1 }],
            getCabinClassName: function (value){
                var res = _.find(helper.cabinClassList, function (item) { return item.value == value });
                return res != null ? res.name : "";
            },

            getTransferCountText: function (count) {
                switch (count) {
                    case 0: return "пересадок";
                    case 1: return "пересадка";
                    case 2: return "пересадки";
                    case 3: return "пересадки";
                    case 4: return "пересадки";
                    case 5: return "пересадок";
                    case 6: return "пересадок";
                    case 7: return "пересадок";
                    case 8: return "пересадок";
                    case 9: return "пересадок";
                    case 10: return "пересадок";
                    default: return "пересадок";
                }
            },

            getSliderTimeFormat: function(text) {
                if (text != null) {
                    text = $filter("date")(text, 'EEE HH:mm');
                    return changeEnToRu(text);
                }
                return '';
            },

            addFormattedDatesFields: function (item) {
                //дополняем полями с форматированной датой и временем
                item.DepartureTimeFormatted = getTimeFormat(item.DepartureDate);
                item.DepartureDateFormatted = getDateFormat(item.DepartureDate, null, true);
                item.ArrivalTimeFormatted = getTimeFormat(item.ArrivalDate);
                item.ArrivalDateFormatted = getDateFormat(item.ArrivalDate, null, true);

                item.BackDepartureTimeFormatted = getTimeFormat(item.BackDepartureDate);
                item.BackDepartureDateFormatted = getDateFormat(item.BackDepartureDate, null, true);
                item.BackArrivalTimeFormatted = getTimeFormat(item.BackArrivalDate);
                item.BackArrivalDateFormatted = getDateFormat(item.BackArrivalDate, null, true);
            },

            //код компании
            getTransporterCode: function (etapsTo) {
                if (etapsTo != null) {
                    if (etapsTo.length == 1) {
                        return { name: etapsTo[0].TransporterName, code: etapsTo[0].TransporterCode };
                    }
                    else if (etapsTo.length > 1) {
                        var firstCode = etapsTo[0].TransporterCode;
                        var firstName = etapsTo[0].TransporterName;
                        for (var i = 1; i < etapsTo.length; i++) {
                            if (etapsTo[i].TransporterCode != firstCode) {
                                //коды отличаются - возвращаем 
                                return { name: manyName, code: manyCode };
                            }
                        }
                        //коды не отличаются - возвращаем код
                        return { name: firstName, code: firstCode };
                    }
                }
            },

            setTransporterListText: function (item, codeEtapsTo, codeEtapsBack) {
                item.TransporterListText = "Разные авиакомпании";
                if (codeEtapsBack != null) {
                    if (codeEtapsTo.code != manyCode && codeEtapsBack.code != manyCode) {
                        if (codeEtapsTo.code == codeEtapsBack.code)
                            item.TransporterListText = codeEtapsTo.name;
                        else
                            item.TransporterListText = codeEtapsTo.name + " / " + codeEtapsBack.name;
                    }
                }
                else {
                    if (codeEtapsTo.code != manyCode) {
                        item.TransporterListText = codeEtapsTo.name;
                    }
                }
            },

            setEtapsTransporterCodeUrl: function (code) {
                return "http://adioso.com/media/i/airlines/" + code + ".png";
            },

            addCustomFields: function (item) {
                var departureDate = dateHelper.apiDateToJsDate(item.DepartureDate);
                var arrivalDate = dateHelper.apiDateToJsDate(item.ArrivalDate);
                var backDepartureDate = dateHelper.apiDateToJsDate(item.BackDepartureDate);
                var backArrivalDate = dateHelper.apiDateToJsDate(item.BackArrivalDate);
                
                item.sort = {
                    DepartureDate: departureDate.getTime(),
                    ArrivalDate: arrivalDate.getTime(),
                    BackDepartureDate: backDepartureDate ? backDepartureDate.getTime() : null,
                    BackArrivalDate: backArrivalDate ? backArrivalDate.getTime() : null,
                    
                    DepartureHours: departureDate.getHours(),
                    ArrivalHours: arrivalDate.getHours(),
                    BackDepartureHours: backDepartureDate ? backDepartureDate.getHours() : null,
                    BackArrivalHours: backArrivalDate ? backArrivalDate.getHours() : null,
                };

                //console.log(item.DepartureDate + ' hours: ' + item.sort.DepartureHours);
                //console.log(item.ArrivalDate + ' hours: ' + item.sort.ArrivalHours);
                //console.log(item.BackDepartureDate + ' hours: ' + item.sort.BackDepartureHours);
                //console.log(item.BackArrivalDate + ' hours: ' + item.sort.BackArrivalHours);

                //дополняем полями с форматированной датой и временем
                helper.addFormattedDatesFields(item);

                //TransporterCode
                var codeEtapsTo = helper.getTransporterCode(item.EtapsTo);
                var codeEtapsBack = helper.getTransporterCode(item.EtapsBack);
                item.EtapsToTransporterCodeUrl = helper.setEtapsTransporterCodeUrl(codeEtapsTo.code);
                item.EtapsToTransporterName = codeEtapsTo.name;
                if (codeEtapsBack != null) {
                    item.EtapsBackTransporterCodeUrl = helper.setEtapsTransporterCodeUrl(codeEtapsBack.code);
                    item.EtapsBackTransporterName = codeEtapsBack.name;
                }

                //время в пути
                item.TimeToFormatted = getFlightTimeFormatted(item.TimeTo);
                item.TimeBackFormatted = getFlightTimeFormatted(item.TimeBack);

                //авиакомпании, текст Разные авиакомпании, список
                helper.setTransporterListText(item, codeEtapsTo, codeEtapsBack);

                //этапы
                if (item.EtapsTo.length > 1) {
                    item.EtapsToItems = [];
                    for (var k = 0; k < item.EtapsTo.length - 1; k++) {
                        var etap = item.EtapsTo[k];
                        var waitTime = getFlightTimeFormatted(etap.TransferWaitTime);
                        item.EtapsToItems.push({ code: etap.InCode, name: etap.InPort, waitTime: waitTime });
                    }
                }
                if (item.EtapsBack.length > 1) {
                    item.EtapsBackItems = [];
                    for (var k = 0; k < item.EtapsBack.length - 1; k++) {
                        var etap = item.EtapsBack[k];
                        var waitTime = getFlightTimeFormatted(etap.TransferWaitTime);
                        item.EtapsBackItems.push({ code: etap.InCode, name: etap.InPort, waitTime: waitTime });
                    }
                }

                function addFieldsToEtap(etap, etapNext) {
                    etap.TransporterCodeUrl = helper.setEtapsTransporterCodeUrl(etap.TransporterCode);
                    etap.OutTimeFormatted = getTimeFormat(etap.OutTime);
                    etap.OutDateFormatted = getDateFormat(etap.OutTime);
                    etap.InTimeFormatted = getTimeFormat(etap.InTime);
                    etap.InDateFormatted = getDateFormat(etap.InTime);
                    etap.WaitTimeFormatted = getFlightTimeFormatted(etap.TransferWaitTime);
                    etap.WayTimeFormatted = getFlightTimeFormatted(etap.WayTime);

                    if (etapNext != null) {
                        etap.NextOutPort = etapNext.OutPort;
                        etap.NextOutPortId = etapNext.OutPortId;
                        etap.NextOutCity = etapNext.OutCity;
                        etap.NextOutCode = etapNext.OutCode;
                        etap.NextOutCountryName = etapNext.OutCountryName;
                    }
                }

                for (var e = 0; e < item.EtapsTo.length; e++) {
                    var etap = item.EtapsTo[e];
                    var etapNext = null;
                    if ((e + 1) < item.EtapsTo.length) {
                        etapNext = item.EtapsTo[e + 1];
                    }
                    addFieldsToEtap(etap, etapNext);
                }
                for (var e = 0; e < item.EtapsBack.length; e++) {
                    var etap = item.EtapsBack[e];
                    var etapNext = null;
                    if ((e + 1) < item.EtapsBack.length) {
                        etapNext = item.EtapsBack[e + 1];
                    }
                    addFieldsToEtap(etap, etapNext);
                }
            },

            baloonType: baloonType,

            baloon: {
                isVisible: false,
                caption: '',
                text: '',
                data: null,
                type: baloonType.msg,
                closeFn: null,
                showGlobalAviaErr: function() {
                    helper.baloon.show("Что-то пошло не так", "Свяжитесь с оператором по телефону <b>+7 495 742-1212</b>",
                        baloonType.err, function () {
                            $location.path(Urls.URL_AVIA);
                        });
                },
                showErr: function (caption, text, closeFn) {
                    helper.baloon.show(caption, text, baloonType.err, closeFn);
                },
                showWithClose: function (caption, text, closeFn) {
                    helper.baloon.show(caption, text, baloonType.msgClose, closeFn);
                },
                show: function (caption, text, type, closeFn, data) {
                    //console.log('show', caption, text, type);
                    if (type == null){
                        helper.baloon.type = baloonType.msg;
                    }
                    else {
                        helper.baloon.type = type;
                    }

                    helper.baloon.caption = caption;
                    helper.baloon.text = text;
                    helper.baloon.closeFn = closeFn;
                    helper.baloon.isVisible = true;
                    helper.baloon.data = data;
                    //$rootScope.$broadcast('baloon.show');
                },
                hide: function () {
                    //console.log('baloon hide');
                    helper.baloon.isVisible = false;
                    //$rootScope.$broadcast('baloon.hide');
                }
            },

            getDateFormat: function (dateText, customDateFormat) {
                return getDateFormat(dateText, customDateFormat);
            },

            pluralForm: function (i, str1, str2, str3) {
                return pluralForm(i, str1, str2, str3);
            },

            eof: null
        };
        return helper;
    }]);