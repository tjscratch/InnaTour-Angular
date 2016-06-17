var track = {
    PREFIX: 'track_results_',
    aviaKey: 'avia_',
    dpKey: 'dp_',
    writeAnalitics: function (gaGoal, yaGoal) {
//        console.log('writeAnalitics', gaGoal, yaGoal)
        if (gaGoal != null && window.ga != null) {
            ga('send', 'pageview', gaGoal);
        }
        if (yaGoal != null && window.yaCounter12702715 != null) {
            yaCounter12702715.reachGoal(yaGoal);
        }

       /* if (Raven) {
            var dataRaven = {
                extra: {
                    data: {
                        goal: gaGoal
                    }
                }
            };
            Raven.captureMessage('ANALYTICS', dataRaven);
        }*/
    },
    denyTrackSuccessResult: function (page, key) {
        localStorage.setItem(track.PREFIX + page + key, 1);
        //console.log('analitics, denyTrackSuccessResult()');
    },
    isTrackSuccessResultAllowed: function (page, key) {
        var item = localStorage.getItem(track.PREFIX + page + key) || null;
        if (item != null) {
            //console.log('analitics, %s TrackSuccessResult denied', page);
            return false;
        }
        else {
            //console.log('analitics, %s TrackSuccessResult allowed', page);
            return true;
        }
    },
    resetTrackSuccessResult: function (page) {
        //console.log('analitics, reset TrackSuccessResult');
        for (var key in localStorage) {
            //console.log('analitics, localStorage key: %s', key);
            if (key.startsWith(track.PREFIX + page)) {
                localStorage.removeItem(key);
                //console.log('analitics, localStorage key: %s dropped', key);
            }
        }
    },
    gotoBooking: function () {
        //отслеживаем в mixpanel
        if (window.mixpanel != null)
            mixpanel.track("redirect", { "service": "booking" });
        //отслеживаем в гугл аналитике
        track.writeAnalitics('bookingcom');

    },
    offerClick: function (sectionName, type, name, position, fn) {
        //type -  XXL, XL, L...
        //name - название офера
        //position - порядковый номер в секции оферов
        if (window.mixpanel != null)
            mixpanel.track("offer.click", { "section": sectionName, "type": type, "name": name, "position": position }, fn);
        else if (fn != null) fn();
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
        else if (fn != null) fn();
    },
    programDownload: function (name, program_country, category, fn) {
        //name - название программы
        //program_country - страна программы
        //category - категория
        name = name == null ? "" : name;
        program_country = program_country == null ? "" : program_country;
        category = category == null ? "" : category;
        if (window.mixpanel != null)
            mixpanel.track("program.download", { "name": name, "program_country": program_country, "category": category }, fn);
        else if (fn != null) fn();
    },
    requestOpened: function (type, url) {
        //type - откуда кликали на форму из заявки или из блока сбоку (side/program)
        //category - главная страница, раздел экскурсионные туры, образование за рубежом и т.д.
        if (window.mixpanel != null) {
            mixpanel.track("inquiry.form", { "type": type, "url": url });
        }
        track.writeAnalitics(url + '/inquiry');
    },
    requestSend: function (type, url) {
        //type - откуда кликали на форму из заявки или из блока сбоку (side/program)
        //category - главная страница, раздел экскурсионные туры, образование за рубежом и т.д.

        track.programmSend();

        if (window.mixpanel != null) {
            mixpanel.track("inquiry.send", { "type": type, "url": url });
        }
        track.writeAnalitics(url + '/inquiry_sent');
    },
    //ДП. Построение воронок продаж
    //https://innatec.atlassian.net/wiki/pages/viewpage.action?pageId=10518564
    dpSearch: function () {//Клик по кнопке искать формы поиска (форма поиска динамическая)
        track.writeAnalitics('/virtual/packages/search', 'packages_search');
    },
    dpSearchInterrupted: function () {//Нажатие на ссылку "Прервать поиск" во время поиска
        track.writeAnalitics('/virtual/packages/search_interrupted', 'packages_search_interrupted');
    },
    dpAirticketNotAvialable: function () {//NEW Страница отеля. Авиабилет в пакете недоступен
        track.writeAnalitics('/virtual/packages/airticket_not_avialable', 'packages_airticket_not_avialable');
    },
    dpHotelNotAvialable: function () {//NEW Страница отеля. Отель недоступен
        track.writeAnalitics('/virtual/packages/hotel_not_avialable', 'packages_hotel_not_avialable');
    },
    dpSuiteChanged: function () {//NEW Страница отеля. Номер не доступен. Замена номера.
        track.writeAnalitics('/virtual/packages/suite_changed', 'packages_suite_changed');
    },
    dpSuiteNotAvailableError: function () {//NEW Страница отеля. Номер не доступен.
        track.writeAnalitics('/virtual/packages/suite_not_avialable', 'packages_suite_not_avialable');
    },
    successResultsDp: function () { //коды для фиксации успешной выдачи результатов поиска ДП
        track.writeAnalitics('/virtual/packages/search_success', 'packages_search_success');
    },
    noResultsDp: function () { //нет результатов для поиска ДП (появление меню "мы ничего не нашли")
        track.writeAnalitics('/virtual/packages/search_no_results', 'packages_search_no_results');
    },
    dpBuyPackage: function () {//нажатие кнопки "купить" на форме поиска пакета
        track.writeAnalitics('/virtual/packages/buy_variant', 'packages_buy_variant');
    },
    dpApiTicketChanged: function () {//NEW Cтраница результатов поиска. Переход от партнера (Слетать, Руспо...). Нет авиабилета. Замена авиабилета на рекомендованный.
        track.writeAnalitics('/virtual/packages/api_ticket_changed', 'packages_api_ticket_changed');
    },
    dpApiHotelChanged: function () {//NEW Cтраница результатов поиска. Переход от партнера (Слетать, Руспо...). Нет отеля. Замена отеля на рекомендованный.
        track.writeAnalitics('/virtual/packages/api_hotel_changed', 'packages_api_hotel_changed');
    },
    dpGoReserve: function () {//нажатие кнопки "купить" на форме выбора категории номера на странице отеля
        track.writeAnalitics('/virtual/packages/buy_suite', 'packages_buy_suite');
    },
    dpGoBuy: function () {//Факт нажатия кнопки "перейти к оплате" после заполнения формы данных пассажира и успешного бронирования
        track.writeAnalitics('/virtual/packages/reservation_success', 'packages_reservation_success');
    },
    dpPayBtnSubmitStart: function () {//Факт нажатия кнопки "оплатить" после заполнения формы данных пассажира
        track.writeAnalitics('/virtual/packages/payment_start', 'packages_payment_start');
    },
    dpPayBtnSubmitContinue: function () {//Факт получения ответа от сервера о начале оплаты
        track.writeAnalitics('/virtual/packages/payment_continue', 'packages_payment_continue');
    },
    dpPayBtnSubmitContinueErr: function (err_code) {//Факт получения ответа от сервера о начале оплаты
        track.writeAnalitics('/virtual/packages/payment_continue_' + err_code, 'packages_payment_continue_' + err_code);
    },
    dpFlightNotAvailableError: function () {//Ошибка проверки доступности авиабилета
        track.writeAnalitics('/virtual/packages/flight_not_avialable', 'packages_flight_not_avialable');
    },
    dpPackageNotAvialable: function () {//Страница оплаты. Ошибка проверки доступности пакета
        track.writeAnalitics('/virtual/packages/package_not_avialable', 'packages_package_not_avialable');
    },
    dpReservationError: function () {//Ошибка бронирования пакета
        track.writeAnalitics('/virtual/packages/reservation_error', 'packages_reservation_error');
    },
    dpPaymentError: function (code) {//Ошибка оплаты
        if (code) {
            track.writeAnalitics('/virtual/packages/payment_error_' + code, 'packages_payment_error_' + code);
        }
        else {
            track.writeAnalitics('/virtual/packages/payment_error', 'packages_payment_error');
        }
    },
    dpIssueError: function () {//Ошибка выписки
        track.writeAnalitics('/virtual/packages/issue_error', 'packages_issue_error');
    },
    dpHotelDetails: function () {//Нажатие Подробнее на карточке отеля
        track.writeAnalitics('/virtual/packages/hotel_details', 'packages_hotel_details');
    },
    dpHotelsOnMap: function () {//Нажатие Посмотреть на карте
        track.writeAnalitics('/virtual/packages/hotels_on_map', 'packages_hotels_on_map');
    },
    dpHotelAddress: function () {//Нажатие на ссылку адреса на карточке отеля в результатах
        track.writeAnalitics('/virtual/packages/hotel_address', 'packages_hotel_address');
    },
    dpRoomDetails: function () {//Нажатие на названия номера, детализация по номеру
        track.writeAnalitics('/virtual/packages/room_details', 'packages_room_details');
    },

    dpPayBtnSubmit: function () {
        track.writeAnalitics('/virtual/packages/order_success', 'packages_order_success');
    },
    dpPaymentSubmit: function (orderNum, revenue, IATA1, IATA2, hotelName) {//Страница подтверждения бронирования - фиксация в модуле екомерс ГА факта покупки и суммы
        if (window.ga != null) {
            console.log('track.dpPaymentSubmit, order: %s, revenue: %s', orderNum, revenue);

            ga('require', 'ecommerce', 'ecommerce.js');

            ga('ecommerce:addTransaction', {
                'id': '' + orderNum,                     // номер заказа.
                'affiliation': 'inna.ru',   // адрес сайта (наш, всегда один и тот-же).
                'revenue': '' + revenue               // общая стоимость заказа.
//                'shipping': '0',                  // всегда ноль.
//                'tax': '0'                     // всегда ноль.
            });

            ga('ecommerce:addItem', {
                'id': '' + orderNum, // номер заказа. (тот-же, который в указан в первой части)
                'name': IATA1 + '_' + IATA2 + ' ' + hotelName, //название товара в виде [аэропорт-откуда]_[аэропорт_[куда] [название отеля]
                'sku': 0,
                'category': 'dp', // динамическое пакетирование
                'price': '' + revenue, // сумма заказа
                'quantity': '1' //всегда 1
            });

            ga('ecommerce:send');
        }

       /* if (Raven) {
            var dataRaven = {
                extra: {
                    data: {
                        orderNum: orderNum,
                        revenue: revenue,
                        IATA1: IATA1,
                        IATA2: IATA2,
                        hotelName: hotelName
                    }
                }
            };
            Raven.captureMessage('ANALYTICS', dataRaven);
        }*/
    },
    //Воронка "Авиабилеты"
    aviaSearch: function () { //Нажатие кнопки «Поиск» (Поиск авиабилетов) 
        track.writeAnalitics('/virtual/avia/search', 'avia_search');
    },
    aviaSearchInterrupted: function () {//Нажатие на ссылку "Прервать поиск" во время поиска
        track.writeAnalitics('/virtual/avia/search_interrupted', 'avia_search_interrupted');
    },
    successResultsAvia: function () { //коды для фиксации успешной выдачи результатов поиска авиа
        track.writeAnalitics('/virtual/avia/search_success', 'avia_search_success');
    },
    noResultsAvia: function () { //нет результатов для поиска авиабилетов (появление меню "мы ничего не нашли")
        track.writeAnalitics('/virtual/avia/search_no_results', 'avia_search_no_results');
    },
    aviaChooseVariant: function () { //Нажатие кнопки «Купить» (Выбор авиабилета)
        track.writeAnalitics('/virtual/avia/buy_variant', 'avia_buy_variant');
    },
    aviaGoBuy: function () { //Нажатие кнопки «Перейти к оплате» (Переход к оплате) и успешное бронирование
        track.writeAnalitics('/virtual/avia/reservation_success', 'avia_reservation_success');
    },
    aviaPayBtnSubmitStart: function () { //Нажатие кнопки «Оплатить» (Оплата авиабилета) 
        track.writeAnalitics('/virtual/avia/payment_start', 'avia_payment_start');
    },
    aviaPayBtnSubmitContinue: function () { //Факт получения ответа от сервера о начале оплаты
        track.writeAnalitics('/virtual/avia/payment_continue', 'avia_payment_continue');
    },
    aviaPayBtnSubmitContinueErr: function (err_code) { //Факт получения ответа от сервера о начале оплаты
        track.writeAnalitics('/virtual/avia/payment_continue_' + err_code, 'avia_payment_continue_' + err_code);
    },
    aviaIsAvailableError: function () {//Ошибка проверки доступности
        track.writeAnalitics('/virtual/avia/flight_not_avialable', 'avia_flight_not_avialable');
    },
    aviaReservationError: function () {//Ошибка бронирования авиабилета
        track.writeAnalitics('/virtual/avia/reservation_error', 'avia_reservation_error');
    },
    aviaPaymentError: function (code) {//Ошибка оплаты
        if (code) {
            track.writeAnalitics('/virtual/avia/payment_error_' + code, 'avia_payment_error_' + code);
        }
        else {
            track.writeAnalitics('/virtual/avia/payment_error', 'avia_payment_error');
        }
    },
    aviaIssueError: function () {//Ошибка выписки
        track.writeAnalitics('/virtual/avia/issue_error', 'avia_issue_error');
    },
    aviaPayBtnSubmit: function () {
        track.writeAnalitics('/virtual/avia/order_success', 'avia_order_success');
    },
    aivaPaymentSubmit: function (orderNum, revenue, IATA1, IATA2) {//Страница подтверждения бронирования - фиксация в модуле екомерс ГА факта покупки и суммы
        if (window.ga != null) {
            console.log('track.aivaPaymentSubmit, order: %s, revenue: %s', orderNum, revenue);

            ga('require', 'ecommerce', 'ecommerce.js');

            ga('ecommerce:addTransaction', {
                'id': '' + orderNum,                     // номер заказа (билета).
                'affiliation': 'Inna.ru',   // адрес сайта (наш, всегда один и тот-же).
                'revenue': '' + revenue,               // общая стоимость заказа.
                'shipping': '0',                  // всегда ноль.
                'tax': '0'                     // всегда ноль.
            });

            ga('ecommerce:addItem', {
                'id': '' + orderNum,  //номер заказа (билета)   
                'name': IATA1 + '_' + IATA2, // [аэропорт "откуда"]_[аэропорт_"куда"]
                'sku': 0,
                'category': 'avia', // авиабилет
                'price': '' + revenue, // сумма заказа
                'quantity': '1' //всегда 1
            });

            ga('ecommerce:send');
        }

       /* if (Raven) {
            var dataRaven = {
                extra: {
                    data: {
                        orderNum: orderNum,
                        revenue: revenue,
                        IATA1: IATA1,
                        IATA2: IATA2
                    }
                }
            };
            Raven.captureMessage('ANALYTICS', dataRaven);
        }*/
    },
    //остальные
    toursSearch: function () { //поиск туров
        track.writeAnalitics('/virtual/tour_search', 'tour_search');
    },
    programmSend: function () { //Нажатие кнопки «Отправить» (Отправка заявки на программу)
        track.writeAnalitics('/virtual/prog_request', 'prog_request');
    },
    registrationOpen: function () {//Нажатие на ссылку Регистрация/Вход
        track.writeAnalitics('/virtual/registration_open');
    },
    loginFbSuccess: function () {//Авторизация через соцсеть
        track.writeAnalitics('/virtual/login_fb_success');
    },
    loginGmailSuccess: function () {//Авторизация через соцсеть
        track.writeAnalitics('/virtual/login_gmail_success');
    },
    loginVkSuccess: function () {//Авторизация через соцсеть
        track.writeAnalitics('/virtual/login_vk_success');
    },
    loginOkSuccess: function () {//Авторизация через соцсеть
        track.writeAnalitics('/virtual/login_ok_success');
    },
    loginTwSuccess: function () {//Авторизация через соцсеть
        track.writeAnalitics('/virtual/login_tw_success');
    },
    loginSuccess: function () {//Успешная авторизация через логин/пароль
        track.writeAnalitics('/virtual/login_success');
    },
    newUser: function () {//Регистрация нового пользователя
        track.writeAnalitics('/virtual/new_user');
    },
    requestPassword: function () {//Запрос восстановление пароля
        track.writeAnalitics('/virtual/request_password');
    },
    newAgency: function () {//новое агентство, Успешная регистрация (попап)
        track.writeAnalitics('/virtual/new_agency');
    },
    eof:null
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