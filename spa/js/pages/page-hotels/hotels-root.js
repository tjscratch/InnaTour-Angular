innaAppControllers.controller('HotelsRootController', function ($rootScope, $location, $timeout) {

    /**
     * Отели у нас работают только для b2b клиентов
     * поэтому если не b2b пользователь попал на страницу отелей
     * редиректим его на главную
     */
    //$timeout(function () {
    //    var isAgency = false;
    //    if ($rootScope.$root.user) {
    //        if (parseInt($rootScope.$root.user.getAgencyId()) == 20005 || parseInt($rootScope.$root.user.getAgencyId()) == 2) {
    //            isAgency = true;
    //        }
    //    }
    //    if (isAgency == false) {
    //        $location.path('/#/');
    //    }
    //}, 500);

});
