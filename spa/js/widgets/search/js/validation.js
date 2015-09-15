innaWidgetValidation.factory('widgetValidators', function ($q) {

    return {
        /**
         * проверка значения val
         * если пусто выкидавыем ошибку errorText
         * @param val
         * @param error
         * @param errorText
         */
        required: function (obj, objName, errorText) {
            var deferred = $q.defer();
            var returnObj = {};
            if (obj) {
                returnObj['success'] = true;
                deferred.resolve(returnObj);
            } else {
                returnObj['success'] = false;
                returnObj['name'] = objName;
                returnObj['error'] = errorText;
                deferred.reject(returnObj);
            }
            return deferred.promise;
        },
        /**
         * Сравнение равенства v1 и v2
         * @param v1
         * @param v2
         * @param error
         * @param errorText
         */
        noEqual: function (obj1, obj2, objName, errorText) {
            var deferred = $q.defer();
            var returnObj = {};
            if (obj1 != obj2) {
                returnObj['success'] = true;
                deferred.resolve(returnObj);
            } else {
                returnObj['success'] = false;
                returnObj['name'] = objName;
                returnObj['error'] = errorText;
                deferred.reject(returnObj);
            }
            return deferred.promise;
        }
    }
});


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

