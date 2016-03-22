innaAppDirectives.directive('searchFormHotels', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/search-form-hotels/templ/index.html"),
        controller: function ($scope, HotelService, $routeParams) {

            /**
             * templates url
             */
            //$scope.typeaheadTemplateCustom = $templateCache.get('components/search-form-hotels/templ/typeaheadTemplateCustom.html');

            //console.log($scope.typeaheadTemplateCustom);
            /**
             * поиск локали откуда для авиа и ДП одно и то же
             */
            $scope.getLocationFrom = function (text) {
                return HotelService.getSuggest(text)
                    .then(function (data) {
                        return data;
                    });
            };


        },
        link: function ($scope) {

        }
    }
});
