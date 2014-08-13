angular.module('innaApp.components').factory('FilterSettings',
    function () {

        /**
         * Модель панели фильтрации
         * Наследуется от Ractive
         * Можно сделать set данных и получить их get
         *
         * Можно слушать событие change изменение модели
         * FilterSettings.on('change', function(){})
         */

        function Model(data) {
            return {
                Hotels: {
                    Stars: {
                        list: [
                            {
                                Value: 1,
                                Price : 0
                            },
                            {
                                Value: 2,
                                Price : 0
                            },
                            {
                                Value: 3,
                                Price : 0
                            },
                            {
                                Value: 4,
                                Price : 0
                            },
                            {
                                Value: 5,
                                Price : 0
                            }
                        ].reverse()
                    },
                    Price: {
                        min: 0,
                        max: 0,
                        value: 0
                    },
                    TaFactor: {
                        list: [
                            {value: 1},
                            {value: 2},
                            {value: 3},
                            {value: 4},
                            {value: 5}
                        ].reverse()
                    },
                    HotelName: {
                        value: ''
                    },
                    HotelType: {
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
                    Extra: {
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
                    }
                },
                Tickets: {
                    Airlines: {},
                    Airports: [],
                    AirLegs: {},

                    AirTime: [
                        {
                            direction: 'to',
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
                        {
                            direction: 'back',
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
                    ],
                    Price: {
                        min: 0,
                        max: 0,
                        value: 0
                    }
                },

                sort: {
                    hotels: [
                        {
                            name: 'По цене пакета',
                            value: 'byPackagePrice',
                            isChecked: true
                        },
                        {
                            name: 'По рейтингу Инна Тур',
                            value: 'byRecommendedFactor'
                        },
                        {
                            name: 'По рейтингу Trip Advisor',
                            value: 'byTaFactor'
                        },
                        {
                            name: 'По названию',
                            value: 'byName'
                        },
                        {
                            name: 'По размеру скидки в руб',
                            value: 'byProfit'
                        }
                    ],
                    avia: [
                        {
                            name: 'По цене пакета',
                            value: 'byPackagePrice'
                        },
                        {
                            name: 'По рейтингу',
                            value: 'byRecommend'
                        },
                        {
                            name: 'По времени в пути',
                            value: 'byTripTime'
                        },
                        {
                            name: 'По времени отправления ТУДА',
                            value: 'byDepartureDate'
                        },
                        {
                            name: 'По времени отправления ОБРАТНО',
                            value: 'byBackDepartureDate'
                        },
                        {
                            name: 'По времени прибытия ТУДА',
                            value: 'byArrivalDate'
                        },
                        {
                            name: 'По времени прибытия ОБРАТНО',
                            value: 'byBackArrivalDate'
                        }
                    ]
                }
            }
        }

        var FilterModel = Ractive.extend({

            /**
             * Расширяем дефолтные настройки данными по фильтрам с сервера
             * @param options
             */
            beforeInit: function (options) {
                var model = Model();
                angular.extend(model.Hotels, options.data.model.Hotels);
                angular.extend(model.Tickets, options.data.model.Tickets);
                this.data.settings = model;
            }
        });

        return FilterModel;
    });


