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
        if (text != null) return text.replace(/\n/g, '<br />');
    };
});

innaAppFilters.filter('limitFilter', ['$filter', function ($filter) {
    return function (text, maxLength) {
        if (text != null && text.length > maxLength) {
            var res = $filter('limitTo')(text, maxLength) + '...';
            return res;
        }
        return text;
    }
}]);

//приводит цену (123567) к виду (123 567)
innaAppFilters.filter('price', function () {
    return function (val) {
        if (!val) return val;

        var digits = ("" + val).split('');
        var result = [];

        if (digits.length > 3) {
            digits = digits.reverse();
            for (var i = 0, len = digits.length; i < len; i++) {
                if ((i !== 0) && (i % 3 === 0)) result.push(' ');
                result.push(digits[i]);
            }

            return result.reverse().join('');
        } else return val;
    };
});


/* ================ 3 версии pluralize ========== */
/* ============================================== */
/* ============================================== */
innaAppFilters.filter('asQuantity', ['$filter', function ($filter) {
    return function (n, f1, f2, f5, f0) {
        if (n == 0) return f0;

        return [n, $filter('choosePlural')(n, f1, f2, f5)].join(' ');
    }
}]);

/**
 * @param {Number} number, titles
 * @param {Array} titles
 * @return *
 * utils.pluralize(number, ['пересадка', 'пересадки', 'пересадок']);
 */
innaAppFilters.filter('pluralize', ['$filter', function ($filter) {
    return function (number, titles) {
        var cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }
}]);

innaAppFilters.filter('choosePlural', function () {
    return function (n, f1, f2, f5) {
        if (!f2 && !f5) {
            var bits = f1.split(',');
            f1 = bits[0];
            f2 = bits[1];
            f5 = bits[2];
        }

        //only 2 last digits
        n = n % 100;

        //11, 12, ..., 19
        if (n % 10 + 10 == n) return f5;

        //only one last digit
        n = n % 10;

        if (n == 1) return f1;
        if (n == 2 || n == 3 || n == 4) return f2;

        return f5;
    }
});

/* ============================================== */
/* ============================================== */
/* ============================================== */


innaAppFilters.filter('signed', ['$filter', function ($filter) {
    return function (n) {
        var price = $filter('price');

        if (n >= 0) return '+ ' + price(n);

        return '– ' + price(-n);
    }
}]);

innaAppFilters.filter('defined', function () {
    var undef = typeof(void(0));

    return function (input) {
        return (typeof input !== undef);
    }
});

innaAppFilters.filter('isFloat', function () {
    return function (n) {
        return n === +n && n !== (n | 0);
    }
});

innaAppFilters.filter('lowercaseFirst', function () {
    return function (text) {
        if (!text || !text.length) return text;

        var bits = text.split('');

        bits[0] = bits[0].toLowerCase();

        return bits.join('');
    }
});

innaAppFilters.filter('stripTags', function () {
    return function (input) {
        if (!input) return input;

        return input.replace(/(<([^>]+)>)/ig, " ");
    }
});

innaAppFilters.filter('textOverflow', ['$filter', function ($filter) {
    return  function(text, limit){

        if(text && (text.length > limit))
            return $filter('limitTo')(text, limit) + '...';
        else
            return text;
    };
}]);

innaAppFilters.filter('console', function(){
    return  function(input){
        console.log(input);

        return '';
    };
});