innaAppDirectives.directive('innaOffer', function ($templateCache$location) {
    return {
        restrict: 'E',
        template: function () {
            return $templateCache.get('form.html') ? $templateCache.get('form.html') : $templateCache.get('widgets/offer/templ/offer.html')
        },
        scope: {
            partnerSite: "@",
            partnerName: "@",
            partnerDefaultLocation: "@"
        },
        controller: function ($element, $scope, $http, $q) {
            $scope.partnerDefaultLocation = 'Россия';
        }
    }
});