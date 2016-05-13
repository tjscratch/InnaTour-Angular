innaAppDirectives.directive('offers', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/offers/templ/offers.html"),
        link: function (scope, elem, attr) {

        },
        controller: function ($scope, $location) {

            function randomInteger (min, max) {
                var rand = min + Math.random() * (max - min)
                rand = Math.round(rand);
                return rand;
            }

            var offers = [];
            for (var i = 0; i < 16; i++) {
                var offer = {
                    img: "http://s.test.inna.ru/Files/Photos/140221190450/140221191248/p_960x428.jpg",
                    titleSub: "Куба",
                    titleMain: "Гавана",
                    titleInfo: "7 ночей, на двоих",
                    priceTxt: "от",
                    priceValue: randomInteger(20000, 300000)
                };
                offers.push(offer);
            }

            $scope.offers = _.partitionArray(offers, 3);

        }
    }
});
