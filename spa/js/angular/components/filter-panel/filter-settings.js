angular.module('innaApp.services').service('FilterSettings',
    function () {

        /**
         * Модель панели фильтрации
         * Наследуется от Ractive
         * Можно сделать set данных и получить их get
         *
         * Можно слушать событие change изменение модели
         * FilterSettings.on('change', function(){})
         *
         * @type {Ractive}
         */
        var FilterSettings = new Ractive({
            data: {
                settings: {
                    airlines: {},
                    airports: [],
                    airTime: {
                        to: {
                            title: 'Перелет туда',
                            state: [
                                {
                                    isActive: true,
                                    title: 'Вылет',
                                    value: 'DepartureDate'
                                },
                                {
                                    title: 'Прилет',
                                    value: 'ArrivalDate'
                                }
                            ],
                            dayState: [
                                {
                                    state: 'Morning',
                                    name: 'Утро'
                                },
                                {
                                    state: 'Afternoon',
                                    name: 'День'
                                },
                                {
                                    state: 'Evening',
                                    name: 'Вечер'
                                },
                                {
                                    state: 'Night',
                                    name: 'Ночь'
                                }
                            ]
                        },
                        back: {
                            title: 'Перелет обратно',
                            state: [
                                {
                                    isActive: true,
                                    title: 'Вылет',
                                    value: 'BackDepartureDate'
                                },
                                {
                                    title: 'Прилет',
                                    value: 'BackArrivalDate'
                                }
                            ],
                            dayState: [
                                {
                                    state: 'Morning',
                                    name: 'Утро'
                                },
                                {
                                    state: 'Afternoon',
                                    name: 'День'
                                },
                                {
                                    state: 'Evening',
                                    name: 'Вечер'
                                },
                                {
                                    state: 'Night',
                                    name: 'Ночь'
                                }
                            ]
                        }
                    },
                    price: {
                        min: 10000,
                        max: 100000,
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
                    sort: {
                        hotels: [
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
                        ],
                        avia: [
                            {
                                name: 'По цене пакета',
                                value: 'PackagePrice'
                            },
                            {
                                name: 'По рейтингу Инна Тур',
                                value: 'RecommendedFactor'
                            },
                            {
                                name: 'По времени в пути',
                                value: 'TaFactor'
                            },
                            {
                                name: 'По времени отправления ТУДА',
                                value: 'HotelName'
                            },
                            {
                                name: 'По времени отправления ОБРАТНО',
                                value: 'getProfit'
                            },
                            {
                                name: 'По времени прибытия ТУДА',
                                value: 'getProfit'
                            },
                            {
                                name: 'По времени прибытия ОБРАТНО',
                                value: 'getProfit'
                            }
                        ]
                    }
                }
            }
        });

        return FilterSettings;
    });


