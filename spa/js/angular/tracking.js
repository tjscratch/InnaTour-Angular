

var track = {
    gotoBooking: function () {
        //отслеживаем в mixpanel
        if (window.mixpanel != null)
            mixpanel.track("redirect", { "service": "booking" });
        //отслеживаем в гугл аналитике
        if (window.ga != null)
            ga('send', 'pageview', 'bookingcom');

    },
    offerClick: function (sectionName, type, name, position, fn) {
        //type -  XXL, XL, L...
        //name - название офера
        //position - порядковый номер в секции оферов
        if (window.mixpanel != null)
            mixpanel.track("offer.click", { "section": sectionName, "type": type, "name": name, "position": position }, fn);
        else
            if (fn != null) fn();
    },
    formSearch: function (departure_city_name, country_name, departure_date, flex_date, search_depth, duration, adt_count, chd_count, source, fn) {
        //departure_city_name - город вылета
        //country_name - страна
        //departure_date - дата отправления
        //flex_date - выбор чекбокса +- 5 дней (true/false)
        //search_depth - как далеко вперед дата поиска в днях (дата отправления минус текущая дата)
        //duration - продолжительность (например 7-10)
        //adt_count - количество взр
        //chd_count -  количество детей
        //source - откуда вызван поиск (main/search_result)
        if (window.mixpanel != null)
            mixpanel.track("form.search", {
                "departure_city_name": departure_city_name, "country_name": country_name, "departure_date": departure_date,
                "flex_date": flex_date, "search_depth": search_depth, "duration": duration, "adt_count": adt_count,
                "chd_count": chd_count, "source": source
            }, fn);
        else
            if (fn != null) fn();
    },
    programDownload: function (name, program_country, category, fn)
    {
        //name - название программы
        //program_country - страна программы
        //category - категория
        name = name == null ? "" : name;
        program_country = program_country == null ? "" : program_country;
        category = category == null ? "" : category;
        if (window.mixpanel != null)
            mixpanel.track("program.download", { "name": name, "program_country": program_country, "category": category }, fn);
        else
            if (fn != null) fn();
    },
    requestOpened: function (type, url) {
        //type - откуда кликали на форму из заявки или из блока сбоку (side/program)
        //category - главная страница, раздел экскурсионные туры, образование за рубежом и т.д.
        if (window.mixpanel != null) {
            mixpanel.track("inquiry.form", { "type": type, "url": url });
        }
        if (window.ga != null) {
            ga('send', 'pageview', url + '/inquiry');
        }
    },
    requestSend: function (type, url) {
        //type - откуда кликали на форму из заявки или из блока сбоку (side/program)
        //category - главная страница, раздел экскурсионные туры, образование за рубежом и т.д.
        if (window.mixpanel != null) {
            mixpanel.track("inquiry.send", { "type": type, "url": url });
        }
        if (window.ga != null) {
            ga('send', 'pageview', url + '/inquiry_sent');
        }
    },
    //ДП. Построение воронок продаж
    //https://innatec.atlassian.net/wiki/pages/viewpage.action?pageId=10518564
    dpSearch: function () {//Клик по кнопке искать формы поиска (форма поиска динамическая)
        if (window.ga != null) {
            ga('send', 'pageview', '/virtual/main_search');
        }
        if (window.yaCounter12702715 != null) {
            yaCounter12702715.reachGoal('main_search');
        }
    },
    dpBuyPackage: function () {//нажатие кнопки "купить" на форме поиска пакета
        if (window.ga != null) {
            ga('send', 'pageview', '/virtual/recommended_variant');
        }
        if (window.yaCounter12702715 != null) {
            yaCounter12702715.reachGoal('recommended_variant');
        }
    },
    dpGoReserve: function () {//нажатие кнопки "купить" на форме выбора категории номера на странице отеля
        if (window.ga != null) {
            ga('send', 'pageview', '/virtual/buy_suite');
        }
        if (window.yaCounter12702715 != null) {
            yaCounter12702715.reachGoal('buy_suite');
        }
    },
    dpGoBuy: function () {//Факт нажатия кнопки "перейти к оплате" после заполнения формы данных пассажира
        if (window.ga != null) {
            ga('send', 'pageview', '/virtual/payment');
        }
        if (window.yaCounter12702715 != null) {
            yaCounter12702715.reachGoal('payment');
        }
    },
    dpPaymentSubmit: function (revenue) {//Страница подтверждения бронирования - фиксация в модуле екомерс ГА факта покупки и суммы
        if (window.ga != null) {
            console.log('track.dpPaymentSubmit, revenue: ' + revenue);
            ga('require', 'ecommerce', 'ecommerce.js');

            ga('ecommerce:addTransaction', {
                'id': 'BM-1386656007-794', 'affiliation': 'inna.ru',
                'revenue': revenue //'5497.00' // тут должна быть указана сумма продажи
            });
            ga('ecommerce:send');
        }
    }
};

//$("#gotoBooking").click(function (e) {
//    var href = $(this).attr("href");
//    var isTargetBlank = ($(this).attr("target") == "_blank");

//    function track(fn) {
//        mixpanel.track("redirect", { "service": "booking" }, fn);
//    }

//    if (!isTargetBlank) {
//        e.preventDefault();
//        track(function () { location.href = href; });
//    }
//    else {
//        track();
//    }
//});