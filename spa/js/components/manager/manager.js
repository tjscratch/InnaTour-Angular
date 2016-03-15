innaAppDirectives.directive('manager', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/manager/templ/index.html"),
        //scope: {
        //    orderId: '=',
        //    price: '=',
        //    uid: '='
        //},
        link: function ($scope, element, attrs) {
            $scope.url = "http://52.25.27.254/";
        }
    }
});
