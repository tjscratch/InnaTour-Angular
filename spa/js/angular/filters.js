
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

innaAppFilters.filter('asQuantity', ['$filter', function($filter){
    return function(n, f1, f2, f5, f0){
        if(n == 0) return f0;

        return [n, $filter('choosePlural')(n, f1, f2, f5)].join(' ');
    }
}]);

innaAppFilters.filter('choosePlural', function(){
    return function (n, f1, f2, f5) {
        //only 2 last digits
        n = n % 100;

        //11, 12, ..., 19
        if(n % 10 + 10 == n) return f5;

        //only one last digit
        n = n % 10;

        if(n == 1) return f1;
        if(n == 2 || n == 3 || n == 4) return f2;

        return f5;
    }
});

innaAppFilters.filter('signed', function(){
    return function(n){
        if(n > 0) return '+ ' + n;
        if(n < 0) return '– ' + (-n);

        return 0;
    }
})