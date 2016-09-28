innaAppControllers.controller('OfferLinkController', function ($scope, $routeParams, $location, AppRouteUrls, aviaHelper, dataService) {
    
    // localhost:3000/#/select?DepartureId=6733&ArrivalId=3005&Adult=2&StartDate=2016-11-13&Nights=8&Host=https://inna.ru&TicketClass=0&HotelName=&Price=64401&Stars=5
    // http://lh.inna.ru/wl-test/1001tur/#/select?DepartureId=6733&ArrivalId=3005&Adult=2&StartDate=2016-11-13&Nights=8&Host=https://inna.ru&TicketClass=0&HotelName=&Price=64401&Stars=5
    
    
    var baloon = aviaHelper.baloon;
    baloon.show('Собираем данные', 'Это может занять какое-то время');
    
    
    dataService.getOfferLink($routeParams)
        .then(
            function (res) {
                if (res.data) {
                    // window.location.href = res.data;
                    // $location.url(res.data);
                    
                    var urlDetails = res.data;
                    if (window.partners && window.partners.isFullWL()) {
                        urlDetails = window.partners.getParentLocationWithUrl(urlDetails);
                    }
                    $location.url(urlDetails);
                    baloon.hide();
                }
            },
            function (res) {
                baloon.showAlert('Произошла ошибка', '',
                    function () {
                        baloon.hide();
                        $location.url(AppRouteUrls.URL_ROOT);
                    });
            }
        );
    
    
    $scope.$on('$destroy', function () {
        baloon.hide();
    });
});
