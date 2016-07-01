innaAppServices.service('Offer', function ($http, appApi) {
    return {
        getOffers: function (params) {
            return $http({
                url: appApi.GET_OFFERS,
                method: "GET",
                params: params
            })
        },
        sortable: function (sortableType, offers) {
            var sortOffers;
            if (sortableType == 0) {
                sortOffers = _.sortBy(offers, function (o) {
                    return o.Price > 0;
                });
            }
            if (sortableType == 1) {
                sortOffers = _.sortBy(offers, function (o) {
                    return o.Price;
                });
            }
            if (sortableType == 2) {
                sortOffers = _.sortBy(offers, function (o) {
                    return -o.Price;
                });
            }
            return _.partitionArray(sortOffers, 2);
        },
        //
        // генерация фейковых офферов
        //
        mock: function (length) {
            function randomInteger (min, max) {
                var rand = min + Math.random() * (max - min)
                rand = Math.round(rand);
                return rand;
            };
            var offers = [];
            for (var i = 0; i < length; i++) {
                var offersItem = {
                    img: "http://s.test.inna.ru/Files/Photos/140221190450/140221191248/p_960x428.jpg",
                    titleSub: "Куба",
                    titleMain: "Гавана",
                    titleInfo: "7 ночей, на двоих",
                    priceTxt: "от",
                    priceValue: randomInteger(20000, 300000),
                    popular: randomInteger(1, 100)
                };
                offers.push(offersItem);
            }
            ;
            return offers;
        }
    }
});
