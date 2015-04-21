innaWidgetValidation.factory('widgetValidators', [function () {

    return {
        /**
         * проверка значения val
         * если пусто выкидавыем ошибку errorText
         * @param val
         * @param error
         * @param errorText
         */
        required: function (val, error, errorText) {
            if (!val) {
                error.text = errorText
                throw error
            }
        },
        /**
         * Сравнение равенства v1 и v2
         * @param v1
         * @param v2
         * @param error
         * @param errorText
         */
        noEqual: function (v1, v2, error, errorText) {
            if (v1 == v2) {
                error.text = errorText
                throw error
            }
        }
    }
}]);


innaWidgetValidation
    .filter('widgetRange', function () {
        return function (input, total) {
            total = parseInt(total);
            for (var i = 0; i < total; i++)
                input.push(i);
            return input;
        };
    })
    .filter('WidgetAsQuantity', ['$filter', function ($filter) {
        return function (n, f1, f2, f5, f0) {
            return [n, $filter('choosePlural')(n, f1, f2, f5)].join(' ');
        }
    }]);

