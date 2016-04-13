innaAppControllers.controller('HotelsRootController', function ($rootScope, $location, $timeout) {

    /**
     * Отели у нас работают только для b2b клиентов
     * поэтому если не b2b пользователь попал на страницу отелей
     * редиректим его на главную
     */
    $timeout(function () {
        var isAgency = false;
        if ($rootScope.$root.user) {
            isAgency = $rootScope.$root.user.isAgency();
        }
        if (isAgency == false) {
            $location.path('/#/');
        }
    }, 500);

});
