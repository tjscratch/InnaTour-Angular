innaAppServices.service('FilterService', [
    '$log',
    '$timeout',
    '$filter',
    function ($log, $timeout, $filter) {

        return {

            /**
             * Метод фильтрации списка
             *
             * Фильтруем исходный массив collection
             *
             * Каждый фильтр должен иметь функцию фильтрации - fn
             * filters.fn();
             * в качестве параметра примемает значение свойства item[filter.name]
             *
             * @param {Array} collection - коллекция для фильтрации
             * @param {Array} filterCollection - набор фильров
             * @return {Array} новый набор
             */
            filterListPanel: function (param_filter) {
                var filterEnumerable = [];
                var filterCollection = param_filter.collection;
                var filters = param_filter.filterCollection;


                // проход по коллекции данных
                for (var j = 0; j < filterCollection.length; j++) {
                    var item = filterCollection[j];

                    // проход по фильтрам
                    var filterResult = filters.filter(function (filter) {
                        
                        if (item[filter.name] == undefined) {
                            return false;
                        }

                        // для некоторых компонентов нужно передать не просто поле
                        // по которому фильтруем, а весь item, так как более сложному фильтру нужно несколько полей
                        if (filter.fn != undefined) {

                            var paramForFn = item[filter.name];
                            switch (filter.name) {
                                case 'DepartureDate':
                                    paramForFn = item;
                                case 'AirportFrom':
                                    paramForFn = item;
                                case 'AirLegs':
                                    paramForFn = item;
                            }

                            return filter.fn(paramForFn, filter);
                        }
                    });


                    //console.log('filterResult')
                    //console.log(filterResult)
                    if (filterResult.length == filters.length) {
                        filterEnumerable.push(item);
                    }

                }

                return filterEnumerable;
            },

            sortListPanel: function (sortCollection, sortData) {
                if (!sortCollection || !sortCollection.length) return false;

                var sortType = {
                    byAgencyProfit: ['-PriceDetails.Profit'],
                    byRecommend: ['-IsRecomendation', 'RecommendedFactor', 'DepartureDate', 'ArrivalDate'],
                    byPrice: ['Price', 'DepartureDate', 'ArrivalDate'],
                    byTripTime: ['TimeTo', 'Price', 'DepartureDate', 'ArrivalDate'],
                    byDepartureDate: 'DepartureDateSort',
                    byBackDepartureDate: 'BackDepartureDateSort',
                    byArrivalDate: 'ArrivalDateSort',
                    byBackArrivalDate: 'BackArrivalDateSort',
                    byPackagePrice: 'PackagePrice',
                    byRecommendedFactor: 'RecommendedFactor',
                    byTaFactor: '-TaFactor',
                    byName: 'HotelName',
                    byProfit: '-getProfit'
                };

                var val = sortData.val;
                var defaultSort = sortData.defaultSort;
                var expression = null;

                if (val != '')
                    expression = sortType[val];
                else
                    expression = sortType[defaultSort];

                var result = $filter('orderBy')(sortCollection, expression);

                expression = null;
                sortCollection = null;
                sortData = null;

                return [].concat(result);
            }
        }

    }]);