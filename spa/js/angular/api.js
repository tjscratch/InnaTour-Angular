angular.module('innaApp.API', [])
    .factory('innaApp.API.const', function(){
        function url(s){
            return (app_main.host || 'http://api.test.inna.ru') + '/api/v1' + s;
        }

        return {
            DYNAMIC_FROM_SUGGEST: url('/Packages/From'),
            DYNAMIC_TO_SUGGEST: url('/Packages/To'),
            DYNAMIC_GET_OBJECT_BY_ID: url('/Packages/DirectoryById'),

            AUTH_SIGN_UP: url('/Account/Register/Post'),
            AUTH_SIGN_IN: url('/Account/Login/Post'),
            AUTH_RESTORE_A: url('/Account/ForgotPassword/Post'),
            AUTH_RESTORE_B: url('/Account/ResetPassword/Post'),
            AUTH_SOCIAL_BROKER: url('/Account/Broker/')
        }
    })