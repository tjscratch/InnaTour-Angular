innaAppServices.service('CheckSmsService', function ($http, appApi) {
    return {
        getSmsCode: function (data) {
            return $http({
                url: appApi.GET_SMS_CODE,
                method: 'POST',
                data: data
            });
        },
        checkSmsCode: function (data) {
            return $http({
                url: appApi.CHECK_SMS_CODE,
                method: 'POST',
                data: data
            });
        }
    }
});
