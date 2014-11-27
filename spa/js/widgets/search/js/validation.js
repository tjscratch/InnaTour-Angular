(function () {
    "use strict"

    var innaValidation = angular.module('innaValidation', []);

    innaValidation.factory('Validators', [function () {

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

}());