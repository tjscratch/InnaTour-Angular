
'use strict';

/* Filters */

innaAppFilters.filter('interpolate', ['version', function (version) {
      return function (text) {
          return String(text).replace(/\%VERSION\%/mg, version);
      }
  }]);

//фильтр для поиска элемента в массиве, аналог ko.utils.arrayFirst
innaAppFilters.filter('arrayFirst', function () {
      return function (input, equalsCallback) {
          if (input != null) {
              for (var i = 0; i < input.length; i++) {
                  if (equalsCallback(input[i]) == true) {
                      return input[i];
                  }
              }
          }
          return null;
      }
});

innaAppFilters.filter('breakFilter', function () {
    return function (text) {
        if (text !== undefined) return text.replace(/\n/g, '<br />');
    };
});

//приводит цену (123567) к виду (123 567)
innaAppFilters.filter('price', function () {
    return function (val) {
        if (val !== undefined) {
            val = "" + val;
            if (val.length > 3) {
                var start = val.substring(0, val.length - 3);
                var ending = val.substring(val.length - 3, val.length);
                return start + " " + ending;
            }
            else
                return val;
        }
        return val;
    };
});

////фильтр по названию, мин, макс цене
//innaAppFilters.filter('filterByParams', function () {
//    return function (input, filter) {

//        var minPrice = filter.minPrice;
//        var maxPrice = filter.maxPrice;
//        var hotelName = filter.hotelName;

//        //пропускаем пустые
//        if (minPrice == null || maxPrice == null)
//            return input;

//        console.log('filterByParams: ' + angular.toJson(filter));

//        var out = [];
//        //если не изменился - возвращаем тот же объект
//        var isChanged = false;
//        if (input != null) {
//            for (var i = 0; i < input.length; i++) {
//                var fPrice = parseFloat(input[i].Price);

//                var isFilterByName = true;
//                //если задан фильтр по имени
//                if (hotelName != null && hotelName.length > 0) {
//                    //не чувств. к регистру
//                    if (input[i].HotelName.toLowerCase().indexOf(hotelName.toLowerCase()) > -1)
//                        isFilterByName = true;
//                    else
//                        isFilterByName = false;
//                }

//                if (isFilterByName && fPrice >= minPrice && fPrice <= maxPrice) {
//                    out.push(input[i]);
//                }
//                else
//                    isChanged = true;
//            }
//        }

//        if (isChanged)
//            return out;
//        else
//            return input;
//    }
//});
