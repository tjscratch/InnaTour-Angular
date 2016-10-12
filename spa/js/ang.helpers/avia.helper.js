innaAppServices.
    factory('aviaHelper', [
        '$rootScope',
        '$http',
        '$log',
        '$filter',
        '$timeout',
        '$location',
        'innaApp.Urls',
        'eventsHelper',
        'urlHelper',
        function ($rootScope, $http, $log, $filter, $timeout, $location, Urls, eventsHelper, urlHelper) {
            function log(msg) {
                $log.log(msg);
            }

            var manyCode = "many";
            var manyName = "Несколько авиакомпаний";
            var emptyCode = "empty";

            var timeFormat = "HH:mm";
            var dateFormat = "dd MMM yyyy, EEE";
            var shortDateFormat = "dd MMM, EEE";

            function dateToMillisecs(date) {
                var res = dateHelper.apiDateToJsDate(date);
                if (res != null)
                    return res.getTime();
                else
                    return null;
            }

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
                { En: "Dec", Ru: "декабря" }
            ];

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
                { En: "Dec", Ru: "дек" }
            ];

            var weekDaysEnToRus = [
                { En: "Mon", Ru: "пн" },
                { En: "Tue", Ru: "вт" },
                { En: "Wed", Ru: "ср" },
                { En: "Thu", Ru: "чт" },
                { En: "Fri", Ru: "пт" },
                { En: "Sat", Ru: "сб" },
                { En: "Sun", Ru: "вс" }
            ];

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
                    else if (h == 0)
                        return addMins + " мин";
                    else
                        return h + " ч " + addMins + " мин";
                }
                return "";
            }

            function pluralForm(i, str1, str2, str3) {
                function plural(a) {
                    if (a % 10 == 1 && a % 100 != 11) return 0;
                    else if (a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20)) return 1;
                    else return 2;
                }

                switch (plural(i)) {
                    case 0:
                        return str1;
                    case 1:
                        return str2;
                    default:
                        return str3;
                }
            }

            var baloonType = {
                msg: 'msg',
                alert: 'alert',
                err: 'err',
                msgClose: 'msgClose',
                msgCancel: 'msgCancel',
                success: 'success',
                email: 'email',
                expireCheck: 'expireCheck',
                payExpires: 'payExpires',
                notFound: 'notFound',
                priceChanged: 'priceChanged',
	            agencyRegSuccess: 'agencyRegSuccess'
            };

            var helper = {
                moment: moment,

                sexType: { man: 1, woman: 2 },

                directionType: { departure: 'departure', arrival: 'arrival', backDeparture: 'backDeparture', backArrival: 'backArrival' },
                dayTime: { morning: 'morning', day: 'day', evening: 'evening', night: 'night' },

                cabinClassList: [
                    { name: 'Эконом', value: 0 },
                    { name: 'Бизнес', value: 1 }
                ],
                getCabinClassName: function (value) {
                    var res = _.find(helper.cabinClassList, function (item) {
                        return item.value == value
                    });
                    return res != null ? res.name : "";
                },

                getSliderTimeFormat: function (text) {
                    if (text != null) {
                        text = $filter("date")(text, 'EEE HH:mm');
                        return changeEnToRu(text);
                    }
                    return '';
                },

                getRuDateFormat: function (text, enFormat, useShort) {
                    if (text != null && enFormat != null) {
                        text = $filter("date")(text, enFormat);
                        return changeEnToRu(text, useShort);
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
                getTransporterLogo: function (etapsTo) {
                    if (etapsTo != null) {
                        if (etapsTo.length == 1) {
                            return { name: etapsTo[0].TransporterName, logo: etapsTo[0].TransporterLogo };
                        }
                        else if (etapsTo.length > 1) {
                            var firstCode = etapsTo[0].TransporterLogo;
                            var firstName = etapsTo[0].TransporterName;
                            for (var i = 1; i < etapsTo.length; i++) {
                                if (etapsTo[i].TransporterLogo != firstCode) {
                                    //коды отличаются - возвращаем
                                    return { name: manyName, logo: manyCode };
                                }
                            }
                            //коды не отличаются - возвращаем код
                            return { name: firstName, logo: firstCode };
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


                setEtapsTransporterCodeUrl: function (logo) {
                    return "http://adioso.com/media/i/airlines/" + logo + ".png";
                    if (logo == null || logo.length == 0) {
                        logo = emptyCode;
                    }

                    if (logo == manyCode) {
                        return "/spa/img/group.png";
                    }
                    else {
                        return app_main.staticHost + "/Files/logo/" + logo + ".png";
                    }
                    return app_main.staticHost + "/Files/logo/" + logo + ".png";
                },

                getLuggageLimitFromValue: function (luggageLimit) {
                    var baggage = '';
                    var alert = false;
                    switch (luggageLimit) {
                        case '': baggage = ''; break;
                        case '0': baggage = 'Платный багаж!'; alert = true; break;
                        default: baggage = luggageLimit; break;
                    }

                    return {baggage: baggage, alert: alert}
                },

                addCustomFields: function (item) {
                    var departureDate = dateHelper.apiDateToJsDate(item.DepartureDate);
                    var arrivalDate = dateHelper.apiDateToJsDate(item.ArrivalDate);
                    var backDepartureDate = dateHelper.apiDateToJsDate(item.BackDepartureDate);
                    var backArrivalDate = dateHelper.apiDateToJsDate(item.BackArrivalDate);

                    // TODO : заменить даты на время
                    item.sort = {
                        DepartureDate: departureDate.getTime(),
                        ArrivalDate: arrivalDate.getTime(),
                        BackDepartureDate: backDepartureDate ? backDepartureDate.getTime() : null,
                        BackArrivalDate: backArrivalDate ? backArrivalDate.getTime() : null,

                        DepartureHours: departureDate.getHours(),
                        ArrivalHours: arrivalDate.getHours(),
                        BackDepartureHours: backDepartureDate ? backDepartureDate.getHours() : null,
                        BackArrivalHours: backArrivalDate ? backArrivalDate.getHours() : null
                    };

                    //console.log(item.DepartureDate + ' hours: ' + item.sort.DepartureHours);
                    //console.log(item.ArrivalDate + ' hours: ' + item.sort.ArrivalHours);
                    //console.log(item.BackDepartureDate + ' hours: ' + item.sort.BackDepartureHours);
                    //console.log(item.BackArrivalDate + ' hours: ' + item.sort.BackArrivalHours);

                    //дополняем полями с форматированной датой и временем
                    helper.addFormattedDatesFields(item);

                    //TransporterCode
                    var codeEtapsTo = helper.getTransporterLogo(item.EtapsTo);
                    var codeEtapsBack = helper.getTransporterLogo(item.EtapsBack);
                    item.EtapsToTransporterCodeUrl = helper.setEtapsTransporterCodeUrl(codeEtapsTo.logo);
                    item.EtapsToTransporterName = codeEtapsTo.name;
                    if (codeEtapsBack != null) {
                        item.EtapsBackTransporterCodeUrl = helper.setEtapsTransporterCodeUrl(codeEtapsBack.logo);
                        item.EtapsBackTransporterName = codeEtapsBack.name;
                    }

                    //список транспортных компаний
                    var transportersList = [];
                    _.each(item.EtapsTo, function (etap) {
                        transportersList.push({ code: etap.TransporterCode, name: etap.TransporterName, logo: etap.TransporterLogo });
                    });
                    if (item.EtapsBack != null && item.EtapsBack.length > 0) {
                        _.each(item.EtapsBack, function (etap) {
                            transportersList.push({ code: etap.TransporterCode, name: etap.TransporterName, logo: etap.TransporterLogo });
                        });
                    }
                    transportersList = _.uniq(transportersList, false, function (tr) {
                        return tr.code
                    });
                    _.each(transportersList, function (tr) {
                        tr.logoUrl = helper.setEtapsTransporterCodeUrl(tr.logo);
                    });
                    item.transportersList = transportersList;

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

                    function addFieldsToEtap(etap, etapNext, itemBaggageStatus) {
                        etap.TransporterCodeUrl = helper.setEtapsTransporterCodeUrl(etap.TransporterLogo);
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

                        addBaggageFields(etap, itemBaggageStatus);
                    }

                    function addBaggageFields(etap, itemBaggageStatus) {
                        var luggageLimit = etap.LuggageLimit;
                        //console.log('luggageLimit', luggageLimit);

                        var luggageLimitObj = helper.getLuggageLimitFromValue(luggageLimit);

                        etap.baggage = luggageLimitObj.baggage;
                        etap.baggageAlert = luggageLimitObj.alert;

                        if (etap.baggageAlert) {
                            itemBaggageStatus.alert = true;
                        }
                    }

                    //алерт платный багаж в item'e
                    var itemBaggageStatus = { alert: false };

                    for (var e = 0; e < item.EtapsTo.length; e++) {
                        var etap = item.EtapsTo[e];
                        var etapNext = null;
                        if ((e + 1) < item.EtapsTo.length) {
                            etapNext = item.EtapsTo[e + 1];
                        }
                        addFieldsToEtap(etap, etapNext, itemBaggageStatus);
                    }
                    for (var e = 0; e < item.EtapsBack.length; e++) {
                        var etap = item.EtapsBack[e];
                        var etapNext = null;
                        if ((e + 1) < item.EtapsBack.length) {
                            etapNext = item.EtapsBack[e + 1];
                        }
                        addFieldsToEtap(etap, etapNext, itemBaggageStatus);
                    }


                    function addAirPortFromToFields(item) {
                        if (item.EtapsTo.length > 0) {
                            var startEtapTo = item.EtapsTo[0];
                            var endEtapTo = item.EtapsTo[item.EtapsTo.length - 1];

                            if (item.AirportFrom === undefined) {
                                item.AirportFrom = startEtapTo.OutPort;
                            }

                            if (item.OutCode === undefined) {
                                item.OutCode = startEtapTo.OutCode;
                            }
                            if (item.AirportTo === undefined) {
                                item.AirportTo = endEtapTo.InPort;
                            }
                            if (item.InCode === undefined) {
                                item.InCode = endEtapTo.InCode;
                            }
                        }
                    }

                    addAirPortFromToFields(item);

                    //добавляем алерт багажа
                    item.baggageAlert = itemBaggageStatus.alert;

                    //проверка на разные аэропорты отлета и прилета, в одну сторону не учитываем
                    item.alertDifferentPorts = (item.OutCode != item.InCodeBack) && item.EtapsBack.length > 0;

                    //ToDo: debug
                    //item.baggageAlert = true;
                    //item.alertDifferentPorts = true;
                },

                addAggInfoFields: function (item) {
                    //для звезд (особенности верстки)
                    item.starsList = item.Stars > 0 ? _.generateRange(1, item.Stars) : null;
                    item.taStarsList = item.TaFactor > 0 ? _.generateRange(1, item.TaFactor) : null;

                    item.CheckInDate = dateHelper.apiDateToJsDate(item.CheckIn);
                    item.CheckOutDate = dateHelper.apiDateToJsDate(item.CheckOut);
                },

                baloonType: baloonType,

                // TODO : вынести в компонент balloon
                // точнее там все уже есть, нужно найти время и причесать все :)
                baloon: {
                    isVisible: false,
                    caption: '',
                    text: '',
                    data: null,
                    type: baloonType.msg,
                    closeFn: {},
                    showGlobalAviaErr: function () {
                        helper.baloon.show(null, null,
                            baloonType.err, function () {
                                $location.path(Urls.URL_AVIA);
                            });
                    },
                    showGlobalDpErr: function () {
                        helper.baloon.show(null, null, baloonType.err,
                            function () {
                                // TODO : what a fuck ?
                                $location.path(Urls.URL_DYNAMIC_PACKAGES);
                            });
                    },
                    showGlobalErr: function () {
                        helper.baloon.show(null, null,
                            baloonType.err, function () {
                                $location.path(Urls.URL_ROOT);
                            });
                    },
                    showErr: function (caption, text, closeFn) {
                        helper.baloon.show(caption, text, baloonType.err, closeFn);
                    },
                    showAlert: function (caption, text, closeFn) {
                        helper.baloon.show(caption, text, baloonType.alert, closeFn);
                    },
                    showWithClose: function (caption, text, closeFn) {
                        helper.baloon.show(caption, text, baloonType.msgClose, closeFn);
                    },
                    showWithCancel: function (caption, text, closeFn) {
                        helper.baloon.show(caption, text, baloonType.msgCancel, closeFn);
                    },
                    showExpireCheck: function () {
                        helper.baloon.show(null, null, baloonType.expireCheck);
                    },
                    showNotFound: function (caption, text, closeFn) {
                        helper.baloon.show(caption, text, baloonType.notFound, closeFn);
                    },
                    showPriceChanged: function (caption, text, closeFn) {
                        helper.baloon.show(caption, text, baloonType.priceChanged, closeFn);
                    },
	                showAgencyRegSuccess: function (caption, text, closeFn) {
                        helper.baloon.show(caption, text, baloonType.agencyRegSuccess, closeFn);
                    },
                    show: function (caption, text, type, closeFn, data) {
                        //console.log('show', caption, text, type);
                        if (type == null) {
                            helper.baloon.type = baloonType.msg;
                        }
                        else {
                            helper.baloon.type = type;
                        }

                        helper.baloon.caption = caption;
                        helper.baloon.text = text;
                        helper.baloon.closeFn = function(){
                            utils.scrollFix(true);
                            if(closeFn && (typeof closeFn == 'function')) closeFn()
                        };
                        helper.baloon.isVisible = true;
                        helper.baloon.data = data;

                        utils.scrollFix();
                    },
                    hide: function () {
                        utils.scrollFix(true);
                        helper.baloon.isVisible = false;
                    }
                },

                getDateFormat: function (dateText, customDateFormat) {
                    return getDateFormat(dateText, customDateFormat);
                },

                pluralForm: function (i, str1, str2, str3) {
                    return pluralForm(i, str1, str2, str3);
                },

                getCharterAndNumSeatsText: function (ticket) {
                    // countLeft, ticketsCount, isCharter, isDifferentPorts,
                    
                    //console.log('getCharterAndNumSeatsText: countLeft: %d, ticketsCount: %d, isCharter: %s', countLeft, ticketsCount, isCharter);
                    // var sList = [];
                    // var seatsText = helper.getNumSeatsText(countLeft, ticketsCount);
                    // if (seatsText != null && seatsText.length > 0) {
                    //     sList.push(seatsText);
                    // }
                    // if (isCharter) {
                    //     if (sList.length == 0) {
                    //         sList.push('Чартер');
                    //     }
                    //     else {
                    //         sList.push('чартер');
                    //     }
                    // }
                    // if (isDifferentPorts) {
                    //     if (sList.length == 0) {
                    //         sList.push('Разные аэропорты отлета и прилета');
                    //     }
                    //     else if (sList.length == 2 || seatsText.length > 0) {//сокращенная запись, когда не хватает места в строчке
                    //         sList.push('разные а/п отлета и прилета');
                    //     }
                    //     else {
                    //         sList.push('разные аэропорты отлета и прилета');
                    //     }
                    // }
                    //
                    // if (ticket && ticket.IsLongTransfer) {
                    //     sList.push('Долгая пересадка');
                    // }
                    //
                    // if (ticket && ticket.IsNightStop) {
                    //     sList.push('Ночная стыковка');
                    // }
                    //
                    // if (ticket && ticket.baggageAlert) {
                    //     sList.push('Платный багаж');
                    // }

                    var EtapsTo = {
                        isDifferentAirport: false,
                        isLongChange: false,
                        isNightStop: false,
                        isPaidBaggage: false
                    };
                    var EtapsBack = {
                        isDifferentAirport: false,
                        isLongChange: false,
                        isNightStop: false,
                        isPaidBaggage: false
                    };

                    ticket.EtapsTo.forEach(function (item) {
                        if(item.IsAirportChange) {
                            EtapsTo.isDifferentAirport = true;
                        }
                        if(item.IsLongStop) {
                            EtapsTo.isLongChange = true;
                        }
                        if(item.IsNightStop) {
                            EtapsTo.isNightStop = true;
                        }
                    });

                    ticket.EtapsBack.forEach(function (item) {
                        if(item.IsAirportChange) {
                            EtapsBack.isDifferentAirport = true;
                        }
                        if(item.IsLongStop) {
                            EtapsBack.isLongChange = true;
                        }
                        if(item.IsNightStop) {
                            EtapsBack.isNightStop = true;
                        }
                    });

                    // return sList.join(', ');
                    return {
                        EtapsTo: EtapsTo,
                        EtapsBack: EtapsBack
                    };
                },

                getNumSeatsText: function (countLeft, ticketsCount) {
                    countLeft = parseInt(countLeft);
                    function getPluralTickets(count) {
                        return helper.pluralForm(count, 'билет', 'билета', 'билетов');
                    }

                    if (countLeft < 0 || ticketsCount < 0)
                        return '';

                    switch (ticketsCount) {
                        case 1:
                        {
                            if (countLeft == 1) {
                                return 'Остался последний билет';
                            }
                            else if (countLeft <= 3) {
                                return 'Последние ' + countLeft + ' ' + getPluralTickets(countLeft);
                            }
                            break;
                        }
                        case 2:
                        {
                            if (countLeft <= 3) {
                                return 'Остались последние билеты';
                            }
                            else if (countLeft <= 6) {
                                return 'Последние ' + countLeft + ' ' + getPluralTickets(countLeft);
                            }
                            break;
                        }
                        case 3:
                        {
                            if (countLeft <= 5) {
                                return 'Остались последние билеты';
                            }
                            else if (countLeft <= 9) {
                                return 'Последние ' + countLeft + ' ' + getPluralTickets(countLeft);
                            }
                            break;
                        }
                        case 4:
                        {
                            if (countLeft <= 7) {
                                return 'Остались последние билеты';
                            }
                            else if (countLeft <= 9) {
                                return 'Последние ' + countLeft + ' ' + getPluralTickets(countLeft);
                            }
                            break;
                        }
                        case 5:
                        case 6:
                        {
                            if (countLeft <= 9) {
                                return 'Остались последние билеты';
                            }
                            break;
                        }
                    }

                    return '';
                },

                getTicketsCount: function (adultCount, childCount, infantsCount) {
                    //var iAdultCount = parseInt(adultCount);
                    //var infWithPlaces = parseInt(infantsCount) - iAdultCount;
                    //if (infWithPlaces < 0) {
                    //    infWithPlaces = 0;
                    //}
                    //return iAdultCount + parseInt(childCount) + infWithPlaces;

                    //оказывается нужно тупо сложить
                    return parseInt(adultCount) + parseInt(childCount) + parseInt(infantsCount);
                },

                // TODO : вынести в компонент balloon
                // сложная логика этого попапа, 3 шаблона с инклюдами
                // нужно время на переделку
                popupItemInfo: function (ticketsCount, cabinClass) {
                    var self = this;
                    self.isShow = false;
                    self.item = null;

                    self.ticketsCount = ticketsCount;
                    self.hideBuyButton = false;

                    var cabinClass = parseInt(cabinClass);
                    self.ticketsClass = helper.getCabinClassName(cabinClass).toLowerCase();


                    self.show = function ($event, item, criteria, searchId, hideBuyButton) {

                        if ($event) {
                            eventsHelper.preventBubbling($event);
                        }

                        utils.scrollFix();

                        self.isShow = true;
                        self.hideBuyButton = hideBuyButton;
                        item = self.addAggFields(item);
                        self.item = item;

                        if (criteria != null && searchId != null) {
                            var buyCriteria = angular.copy(criteria);
                            buyCriteria.QueryId = searchId;
                            buyCriteria.VariantId1 = item.VariantId1;
                            buyCriteria.VariantId2 = item.VariantId2 != null ? item.VariantId2 : 0;

                            var url = $location.host() + '/#' + urlHelper.UrlToAviaTicketsReservation(buyCriteria);
                            self.link = url;
                        }
                    };

                    self.hide = function () {
                        utils.scrollFix(true);
                        self.isShow = false;
                    };

                    self.addAggFields = function (item) {
                        if (item != null) {
                            item.etapsAgg = [];


                            var maxEtapsLen = item.EtapsTo.length;

                            if (item.EtapsBack != null && item.EtapsBack.length > maxEtapsLen) {
                                maxEtapsLen = item.EtapsBack.length;
                            }

                            for (var i = 0; i < maxEtapsLen; i++) {
                                var etapTo = i < item.EtapsTo.length ? item.EtapsTo[i] : null;
                                var etapBack = i < item.EtapsBack.length ? item.EtapsBack[i] : null;

                                var nextEtapTo = (i + 1) < item.EtapsTo.length ? item.EtapsTo[i + 1] : null;
                                var nextEtapBack = (i + 1) < item.EtapsBack.length ? item.EtapsBack[i + 1] : null;

                                if (etapTo != null) {
                                    etapTo.nextEtapTo = nextEtapTo;
                                }
                                if (etapBack != null) {
                                    etapBack.nextEtapBack = nextEtapBack;
                                }

                                function setAlert(etap, nextEtap) {
                                    if (etap != null) {

                                        var alerts = [];
                                        if (etap.InPortId != etap.NextOutPortId) {
                                            alerts.push("Смена аэропорта");
                                        }
                                        if (etap.TransferWaitTime > 240) {//>4 часов - Долгая пересадка
                                            alerts.push("Долгая пересадка");
                                        }
                                        if (nextEtap != null) {//Ночная стыковка
                                            //различаются дни
                                            var sameDay = etap.InDateFormatted == nextEtap.OutDateFormatted;
                                            //час прилета в этап
                                            var inHour = parseInt(etap.InTimeFormatted.split(':')[0]);
                                            //час отлета из этапа
                                            var outHour = parseInt(nextEtap.OutTimeFormatted.split(':')[0]);
                                            //интервалы прилетов и вылетов пересакаются с интервалом 0-6 часов - ночная стыковка
                                            if (!(inHour > 6 && outHour > 6 && sameDay)) {
                                                alerts.push("Ночная стыковка");
                                            }
                                        }

                                        etap.alert = alerts.join(', ');
                                    }
                                }

                                //алерты
                                setAlert(etapTo, nextEtapTo);
                                setAlert(etapBack, nextEtapBack);

                                item.etapsAgg.push({ etapTo: etapTo, etapBack: etapBack });
                            }
                        }

                        return item;
                    };

                    self.print = function ($event, item) {
                        eventsHelper.preventBubbling($event);
                        alert('Не реализовано');
                    };

                    self.isGetLinkOpen = false;
                    self.link = '';
                    self.getLink = function ($event, item) {
                        eventsHelper.preventBubbling($event);
                        self.isGetLinkOpen = !self.isGetLinkOpen;
                    };
                    self.getLinkClose = function ($event) {
                        eventsHelper.preventBubbling($event);
                        self.isGetLinkOpen = false;
                    };

                    self.share = function ($event, item) {
                        eventsHelper.preventBubbling($event);
                        //alert('Не реализовано');
                    }
                },

                tarifs: function () {
                    var self = this;
                    self.isOpened = false;
                    self.list = [];
                    self.fillInfo = function (aviaInfo) {
                        self.class = aviaInfo.CabineClass == 0 ? 'Эконом' : 'Бизнес';

                        _.each(aviaInfo.EtapsTo, function (etap) {
                            self.list.push({
                                from: etap.OutPort, fromCode: etap.OutCode, to: etap.InPort, toCode: etap.InCode,
                                num: etap.TransporterCode + '-' + etap.Number,
                                rule: etap.Rule,
                                nameFirstLetter: self.getFirstLetter(etap.TariffName)
                            });
                        });

                        if (aviaInfo.EtapsBack != null) {
                            _.each(aviaInfo.EtapsBack, function (etap) {
                                self.list.push({
                                    from: etap.OutPort, fromCode: etap.OutCode, to: etap.InPort, toCode: etap.InCode,
                                    num: etap.TransporterCode + '-' + etap.Number,
                                    rule: etap.Rule,
                                    nameFirstLetter: self.getFirstLetter(etap.TariffName)
                                });
                            });
                        }
                    };

                    self.selectedIndex = 0;
                    self.setected = null;
                    //self.class = $scope.criteria.CabinClass == 0 ? 'Эконом' : 'Бизнес';

                    self.tarifsData = null;
                    self.tarifItem = null;

                    self.getFirstLetter = function (name) {
                        if (name && name.length > 1) {
                            return name.substring(0, 1);
                        }
                        return '';
                    };

                    self.tarifClick = function ($event, item) {
                        if ($event) eventsHelper.preventBubbling($event);
                        self.setected = item;
                        var index = self.list.indexOf(item);
                        if (self.tarifsData != null && self.tarifsData.length > 0) {
                            self.tarifItem = self.tarifsData[index];
                        }
                    };
                    self.setStyle = function () {
                        if (window.partners && window.partners.parentScrollTop > 0) {
                            self.popupStyles = { 'top': window.partners.parentScrollTop + 20 + 'px' };//100px сверху
                        }
                        else {
                            self.popupStyles = null;
                        }
                    };

                    self.show = function ($event) {
                        if ($event) eventsHelper.preventBubbling($event);

                        utils.scrollFix();

                        self.selectedIndex = 0;
                        self.setected = self.list[0];
                        if (self.tarifsData != null && self.tarifsData.length > 0) {

                            self.tarifItem = self.tarifsData[0];
                        }
                        else {
                            self.tarifItem = null;
                        }
                        self.isOpened = true;
                        self.setStyle();
                    };
                    self.close = function ($event) {
                        if ($event) eventsHelper.preventBubbling($event);
                        utils.scrollFix(true);
                        self.isOpened = false;
                    }
                },

                hotelRules: function () {
                    var self = this;
                    self.isOpened = false;
                    self.haveData = false;

                    self.checkIn = null;
                    self.checkOut = null;
                    self.cancellationRules = null;
                    self.extra = null;

                    self.fillData = function (hotel) {
                        self.haveData = true;
                        self.checkIn = hotel.CheckInTime;
                        self.checkOut = hotel.CheckOutTime;
                        if (hotel.Room) {
                            self.cancellationRules = hotel.Room.CancellationRule;
                        }
                        if (hotel.Amenities != null) {
                            self.extra = hotel.Amenities.Amenity_3;
                        }
                    };

                    self.show = function ($event) {
                        eventsHelper.preventBubbling($event);
                        utils.scrollFix();
                        self.isOpened = true;
                    };
                    self.close = function ($event) {
                        eventsHelper.preventBubbling($event);
                        utils.scrollFix(true);
                        self.isOpened = false;
                    }
                },

                insuranceRules: function () {
                    var self = this;
                    self.isOpened = false;

                    self.height = 0;

                    self.calcScreenHeight = function () {
                        var w = window,
                            d = document,
                            e = d.documentElement,
                            g = d.getElementsByTagName('body')[0],
                            x = w.innerWidth || e.clientWidth || g.clientWidth,
                            y = w.innerHeight|| e.clientHeight|| g.clientHeight;

                        self.height = y - 92;

                        if (window.partners && window.partners.clientSize) {
                            var height = window.partners.clientSize.height - 92;
                            if (height < 500){
                                height = 500;
                            }
                            self.height = height;
                        }

                        self.style = {height: self.height };
                    };

                    self.style = null;

                    self.show = function ($event) {
                        eventsHelper.preventBubbling($event);
                        self.calcScreenHeight();
                        utils.scrollFix();
                        self.isOpened = true;
                    };
                    self.close = function ($event) {
                        eventsHelper.preventBubbling($event);
                        utils.scrollFix(true);
                        self.isOpened = false;
                    }
                },

                checkReserveSms: function () {
                    var self = this;
                    self.isOpened = false;

                    self.height = 0;

                    self.calcScreenHeight = function () {
                        var w = window,
                            d = document,
                            e = d.documentElement,
                            g = d.getElementsByTagName('body')[0],
                            x = w.innerWidth || e.clientWidth || g.clientWidth,
                            y = w.innerHeight|| e.clientHeight|| g.clientHeight;

                        self.height = y - 92;

                        if (window.partners && window.partners.clientSize) {
                            var height = window.partners.clientSize.height - 92;
                            if (height < 500){
                                height = 500;
                            }
                            self.height = height;
                        }

                        self.style = {height: self.height };
                    };

                    self.style = null;

                    self.show = function ($event) {
                        eventsHelper.preventBubbling($event);
                        self.calcScreenHeight();
                        utils.scrollFix();
                        self.isOpened = true;
                    };
                    self.close = function ($event) {
                        eventsHelper.preventBubbling($event);
                        utils.scrollFix(true);
                        self.isOpened = false;
                    }
                },

                visaControl: function () {
                    var self = this;

                    self.cautionCountries = [];
                    self.visaNeeded = false;
                    self.visaRulesNeeded = false;

                    self.check = function (passengersCitizenshipIds, currentItem) {
                        function addUniq(array, name, link) {
                            var exists = _.find(array, function (it) {
                                return it.name == name;
                            });

                            if (!exists) {
                                //proxy
                                //href="https://inna.ru/proxy/www.inna.ru
                                if (link && link.indexOf('http://') == 0){
                                    link = 'https://inna.ru/proxy/' + link.replace('http://', '');
                                }
                                array.push({name: name, link: link});
                            }
                        }

                        var isCitRussia = false;
                        var visaEtapNeeded = false;
                        var visaEtapRulesNeeded = false;

                        //console.log('passengersCitizenshipIds:');
                        //console.log(passengersCitizenshipIds);
                        //console.log('currentItem', currentItem);

                        if (passengersCitizenshipIds != null && currentItem != null) {

                            var isAllPassRussia = _.all(passengersCitizenshipIds, function (citId) {
                                return citId == 189;
                            });//189 - Россия

                            //страна куда
                            var lastItem = _.last(currentItem.EtapsTo);
                            //если не 0 - то визовая
                            var visaEtapNeeded = lastItem.InVisaGroup != 0;

                            var outVisaGroup = currentItem.EtapsTo[0].OutVisaGroup;//страна откуда
                            var inVisaGroup = lastItem.InVisaGroup;//страна куда

                            var cautionCountries = [];

                            if (outVisaGroup != inVisaGroup) {
                                addUniq(cautionCountries, lastItem.InCountryName, lastItem.InCountryLink);
                            }

                            if (currentItem.EtapsTo != null) {
                                for (var i = 0; i < currentItem.EtapsTo.length; i++) {
                                    var etap = currentItem.EtapsTo[i];
                                    if (etap.InVisaGroup != outVisaGroup) {
                                        visaEtapRulesNeeded = true;
                                        addUniq(cautionCountries, etap.InCountryName, etap.InCountryLink);
                                    }
                                    if (etap.OutVisaGroup != outVisaGroup) {
                                        visaEtapRulesNeeded = true;
                                        addUniq(cautionCountries, etap.OutCountryName, etap.OutCountryLink);
                                    }
                                }
                            }

                            if (currentItem.EtapsBack != null) {
                                for (var i = 0; i < currentItem.EtapsBack.length; i++) {
                                    var etap = currentItem.EtapsBack[i];
                                    if (etap.InVisaGroup != outVisaGroup) {
                                        visaEtapRulesNeeded = true;
                                        addUniq(cautionCountries, etap.InCountryName, etap.InCountryLink);
                                    }
                                    if (etap.OutVisaGroup != outVisaGroup) {
                                        visaEtapRulesNeeded = true;
                                        addUniq(cautionCountries, etap.OutCountryName, etap.OutCountryLink);
                                    }
                                }
                            }
                            self.cautionCountries = cautionCountries;
                            console.log('cautionCountries:', cautionCountries);
                        }

                        if (isAllPassRussia && visaEtapNeeded) {
                            self.visaNeeded = true;
                        }
                        else {
                            self.visaNeeded = false;
                        }

                        if (visaEtapRulesNeeded) {
                            self.visaRulesNeeded = true;
                        }
                        else {
                            self.visaRulesNeeded = false;
                        }
                    }
                },

                getFlightTimeFormatted: getFlightTimeFormatted,

                eof: null
            };

            return helper;
        }]);
