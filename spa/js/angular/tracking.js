

var track = {
    writeAnalitics: function (gaGoal, yaGoal) {
        if (gaGoal != null && window.ga != null) {
            ga('send', 'pageview', gaGoal);
        }
        if (yaGoal != null && window.yaCounter12702715 != null) {
            yaCounter12702715.reachGoal(yaGoal);
        }
    },
    gotoBooking: function () {
        //отслеживаем в mixpanel
        if (window.mixpanel != null)
            mixpanel.track("redirect", { "service": "booking" });
        //отслеживаем в гугл аналитике
        writeAnalitics('bookingcom');

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

        track.toursSearch();

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
        writeAnalitics(url + '/inquiry');
    },
    requestSend: function (type, url) {
        //type - откуда кликали на форму из заявки или из блока сбоку (side/program)
        //category - главная страница, раздел экскурсионные туры, образование за рубежом и т.д.

        track.programmSend();

        if (window.mixpanel != null) {
            mixpanel.track("inquiry.send", { "type": type, "url": url });
        }
        writeAnalitics(url + '/inquiry_sent');
    },
    //ДП. Построение воронок продаж
    //https://innatec.atlassian.net/wiki/pages/viewpage.action?pageId=10518564
    dpSearch: function () {//Клик по кнопке искать формы поиска (форма поиска динамическая)
        writeAnalitics('/virtual/main_search', 'main_search');
    },
    dpBuyPackage: function () {//нажатие кнопки "купить" на форме поиска пакета
        writeAnalitics('/virtual/recommended_variant', 'recommended_variant');
    },
    dpGoReserve: function () {//нажатие кнопки "купить" на форме выбора категории номера на странице отеля
        writeAnalitics('/virtual/buy_suite', 'buy_suite');
    },
    dpGoBuy: function () {//Факт нажатия кнопки "перейти к оплате" после заполнения формы данных пассажира
        writeAnalitics('/virtual/payment', 'payment');
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
    },
    dpPayBtnSubmit: function () {
        writeAnalitics('/virtual/aviahotel_pay', 'aviahotel_pay');
    },
    //Воронка "Авиабилеты"
    aviaSearch: function () { //Нажатие кнопки «Поиск» (Поиск авиабилетов) 
        writeAnalitics('/virtual/avia_search', 'avia_search');
    },
    aviaChooseVariant: function () { //Нажатие кнопки «Купить» (Выбор авиабилета)
        writeAnalitics('/virtual/avia_variant', 'avia_variant');
    },
    aviaGoBuy: function () { //Нажатие кнопки «Перейти к оплате» (Переход к оплате) 
        writeAnalitics('/virtual/avia_payment', 'avia_payment');
    },
    aviaPayBtnSubmit: function () { //Нажатие кнопки «Оплатить» (Оплата авиабилета) 
        writeAnalitics('/virtual/avia_pay', 'avia_pay');
    },
    toursSearch: function () { //поиск туров
        writeAnalitics('/virtual/tour_search', 'tour_search');
    },
    programmSend: function () { //Нажатие кнопки «Отправить» (Отправка заявки на программу)
        writeAnalitics('/virtual/prog_request', 'prog_request');
    },
    noResultsDp: function () { //нет результатов для поиска ДП (появление меню "мы ничего не нашли")
        writeAnalitics('/virtual/search_noresults', 'search_noresults');
    },
    noResultsAvia: function () { //нет результатов для поиска авиабилетов (появление меню "мы ничего не нашли")
        writeAnalitics('/virtual/search_avianoresults', 'search_avianoresults');
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