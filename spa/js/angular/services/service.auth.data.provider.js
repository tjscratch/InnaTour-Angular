angular.module('innaApp.services')
    .factory('AuthDataProvider', [
        'innaApp.API.const', '$http',
        function(urls, $http){
            return {
                signUp: function(data, callbackSuccess, callbackError){
                    $http({
                        method: 'POST',
                        data: data,
                        url: urls.AUTH_SIGN_UP
                    }).success(callbackSuccess).error(callbackError);
                },
                signIn: function(data, callbackSuccess, callbackError){
                    $http({
                        method: 'POST',
                        data: data,
                        url: urls.AUTH_SIGN_IN
                    }).success(callbackSuccess).error(callbackError);
                },
                sendToken: function(data, success, error){
                    $http({
                        method: 'POST',
                        data: data,
                        url: urls.AUTH_RESTORE_A
                    }).success(callbackSuccess).error(callbackError);
                },
                setNewPassword: function(data, callback, error){
                    $http({
                        method: 'POST',
                        data: data,
                        url: urls.AUTH_RESTORE_B
                    }).success(callbackSuccess).error(callbackError);
                }
            }
        }
    ])