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
                }
            }
        }
    ])