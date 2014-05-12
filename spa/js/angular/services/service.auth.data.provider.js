angular.module('innaApp.services')
    .factory('AuthDataProvider', [
        'innaApp.API.const', 'AjaxHelper',
        function(urls, AjaxHelper){
            return {
                signUp: function(data, callbackSuccess, callbackError){
                    AjaxHelper.postDebaunced(urls.AUTH_SIGN_UP, data, callbackSuccess, callbackError);
                },
                signIn: function(data, callbackSuccess, callbackError){
                    AjaxHelper.postDebaunced(urls.AUTH_SIGN_IN, data, callbackSuccess, callbackError);
                },
                sendToken: function(data, callbackSuccess, callbackError){
                    AjaxHelper.postDebaunced(urls.AUTH_RESTORE_A, data, callbackSuccess, callbackError);
                },
                setNewPassword: function(token, data, success, error){
                    $http({
                        method: 'POST',
                        data: data,
                        url: urls.AUTH_RESTORE_B + '?token=' + token
                    }).success(success).error(error);
                },
                socialBrockerURL: function(method){
                    return urls.AUTH_SOCIAL_BROKER +
                        '?provider=' + method +
                        '&returnUrl=' + encodeURIComponent(document.location.protocol + '//' + document.location.host + '/closer.html');
                },
                confirmRegistration: function(token, callbackSuccess, callbackError) {
                    AjaxHelper.postDebaunced(urls.AUTH_SIGN_UP_STEP_2, {token: token}, callbackSuccess, callbackError);
                },
                logout: function(){
                    AjaxHelper.postDebaunced(urls.AUTH_LOGOUT);
                },
                changeInfo: function(data){
                    return AjaxHelper.postDebaunced(urls.AUTH_CHANGE_INFO, data);
                },
                recognize: function(success){
                    AjaxHelper.postDebaunced(urls.AUTH_RECOGNIZE, {}, success);
                },
                changePassword: function(data){
                    return AjaxHelper.postDebaunced(urls.AUTH_CHANGE_PASSWORD, data);
                }
            }
        }
    ])