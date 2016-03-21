innaAppDirectives.directive('searchFormHotels', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/search-form-hotels/templ/index.html"),
        controller: function ($scope, $routeParams) {

        },
        link: function ($scope) {

        }
    }
});
