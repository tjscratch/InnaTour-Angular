innaAppDirectives.directive('offers', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/offers/templ/offers.html"),
        link: function (scope, elem, attr) {

        },
        controller: function ($scope, $location) {

            var offer = {
                img: "http://s.test.inna.ru/Files/Photos/140221190450/140221191248/p_960x428.jpg",
                titleSub: "Куба",
                titleMain: "Гавана",
                titleInfo: "7 ночей, на двоих",
                priceTxt: "от",
                priceValue: "59 450"
            }

            $scope.offers = [];


            var offers = [];
            for (var i = 0; i < 9; i++) {
                offers.push(offer);
            }


            var copyOffers = angular.copy(offers);
            var newOffers = [];
            var countIndex = 0;
            for (var i = 0; i < offers.length; i++) {
                if (i % 3 == 0) {
                    countIndex = i / 3;
                } else {

                }
                var of = copyOffers.shift(0);
                console.log(countIndex)
                newOffers[countIndex].push(of);
                console.log(newOffers);
            }

        }
    }
});
