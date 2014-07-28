angular.module('innaApp.conponents').
    factory('FilterSettings', [
        function () {
            return {
                price: {
                    min : 10000,
                    max : 100000,
                    value: 30000
                },
                stars: [
                    {value: 1},
                    {value: 2},
                    {value: 3},
                    {value: 4},
                    {value: 5}
                ].reverse(),
                tafactor: {
                    withOutTd: true,
                    list: [
                        {value: 1},
                        {value: 2},
                        {value: 3},
                        {value: 4},
                        {value: 5}
                    ].reverse()
                },
                name: {
                    value: ''
                },
                type: {
                    list: [
                        {
                            name: 'Отель',
                            value: 'hotel'
                        },
                        {
                            name: 'Апарт-отель',
                            value: 'apart_hotel'
                        },
                        {
                            name: 'Пансион',
                            value: 'guesthouse'
                        },
                        {
                            name: 'Квартира',
                            value: 'flat'
                        }
                    ]
                },
                services: {
                    list: [
                        {
                            name: 'Фитнес',
                            value: 'Fitness'
                        },
                        {
                            name: 'Завтрак',
                            value: 'Breakfast'
                        },
                        {
                            name: 'Бар/Ресторан',
                            value: 'BarRestaurant'
                        },
                        {
                            name: 'Парковка',
                            value: 'Parking'
                        },
                        {
                            name: 'Кухня',
                            value: 'Kitchen'
                        },

                        {
                            name: 'Сервисы для людей с о.в',
                            value: 'ForPeopleWithDisabilities'
                        },
                        {
                            name: 'СПА',
                            value: 'SPA'
                        },
                        {
                            name: 'Интернет',
                            value: 'Internet'
                        },
                        {
                            name: 'Бассейн',
                            value: 'SwimmingPool'
                        },
                        {
                            name: 'Сервисы для детей',
                            value: 'ServicesForChildren'
                        }
                    ]
                },
                sort: [
                    {
                        name: 'По цене пакета',
                        value: 'PackagePrice'
                    },
                    {
                        name: 'По рейтингу Инна Тур',
                        value: 'RecommendedFactor'
                    },
                    {
                        name: 'По рейтингу Trip Advisor',
                        value: 'TaFactor'
                    },
                    {
                        name: 'По названию',
                        value: 'HotelName'
                    },
                    {
                        name: 'По размеру скидки в руб',
                        value: 'getProfit'
                    }
                ]
            }
        }]);


