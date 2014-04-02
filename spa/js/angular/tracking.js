
var track = {
    gotoBooking: function () {
        //отслеживаем в mixpanel
        mixpanel.track("redirect", { "service": "booking" });
        //отслеживаем в гугл аналитике
        ga('send', 'pageview', 'bookingcom');

    },
    offerClick: function (sectionName, type, name, position, fn) {
        //type -  XXL, XL, L...
        //name - название офера
        //position - порядковый номер в секции оферов
        mixpanel.track("offer.click", { "section": sectionName, "type": type, "name": name, "position": position }, fn);
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
        mixpanel.track("form.search", {
            "departure_city_name": departure_city_name, "country_name": country_name, "departure_date": departure_date,
            "flex_date": flex_date, "search_depth": search_depth, "duration": duration, "adt_count": adt_count,
            "chd_count": chd_count, "source": source
        }, fn);
    },
    programDownload: function (name, program_country, category, fn)
    {
        //name - название программы
        //program_country - страна программы
        //category - категория
        name = name == null ? "" : name;
        program_country = program_country == null ? "" : program_country;
        category = category == null ? "" : category;
        mixpanel.track("program.download", { "name": name, "program_country": program_country, "category": category }, fn);
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