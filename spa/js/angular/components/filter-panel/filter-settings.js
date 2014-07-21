angular.module('innaApp.conponents').
    factory('FilterSettings', [
        function () {
            return {
                price: {
                    value: 30000
                },
                stars: [
                    {value : 1},
                    {value : 2},
                    {value : 3},
                    {value : 4},
                    {value : 5}
                ].reverse(),
                tafactor: {
                    withOutTd : true,
                    list : [
                        {value : 1},
                        {value : 2},
                        {value : 3},
                        {value : 4},
                        {value : 5}
                    ].reverse()
                },
                name : {
                  value : ''
                },
                type : {
                    list : [
                        {
                            name : 'Отель',
                            value : 'hotel'
                        },
                        {
                            name : 'Апарт-отель',
                            value : 'apart_hotel'
                        },
                        {
                            name : 'Пансион',
                            value : 'guesthouse'
                        },
                        {
                            name : 'Квартира',
                            value : 'flat'
                        }
                    ]
                },
                services : {
                    list : [
                        {
                            name : 'Фитнес',
                            value : 'fitness'
                        },
                        {
                            name : 'Интернет',
                            value : 'ethernet'
                        },
                        {
                            name : 'Бассейн',
                            value : 'pool'
                        },
                        {
                            name : 'Сервисы для детей',
                            value : 'for_children'
                        }
                    ]
                },
                sort : [
                    {
                        name : 'По цене пакета',
                        value : 1
                    },
                    {
                        name : 'По рейтингу Инна Тур',
                        value : 2
                    },
                    {
                        name : 'По рейтингу Trip Advisor',
                        value : 3
                    },
                    {
                        name : 'По названию',
                        value : 4
                    },
                    {
                        name : 'По размеру скидки в руб',
                        value : 5
                    }
                ]
            }
        }]);


