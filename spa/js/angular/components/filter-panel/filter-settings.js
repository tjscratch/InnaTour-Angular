angular.module('innaApp.conponents').
    factory('FilterSettings', [
        function () {
            return {
                price: {
                    value: 20000
                },
                stars: [1, 2, 3, 4, 5].reverse(),
                tafactor: {
                    withOutTd : true,
                    list : [1, 2, 3, 4, 5].reverse()
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


