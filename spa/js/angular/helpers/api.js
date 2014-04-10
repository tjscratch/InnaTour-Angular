angular.module('innaApp.API', [])
    .factory('innaApp.API.const', function(){
        function url(s){
            var DEV = true;

            return (DEV ? 'http://api.lh.inna.ru/' :(app_main.host || 'http://api.test.inna.ru')) + '/api/v1' + s;
        }

        return {
            DYNAMIC_FROM_SUGGEST: url('/Packages/From'),
            DYNAMIC_TO_SUGGEST: url('/Packages/To'),
            DYNAMIC_GET_OBJECT_BY_ID: url('/Packages/DirectoryById'),
            DYNAMIC_SEARCH: url('/Packages/Search'),
            DYNAMIC_HOTEL_DETAILS: url('/Packages/SearchHotel'),

            AUTH_SIGN_UP: url('/Account/Register/Post'),
            AUTH_SIGN_IN: url('/Account/Login/Post'),
            AUTH_RESTORE_A: url('/Account/ForgotPassword/Post'),
            AUTH_RESTORE_B: url('/Account/ResetPassword/Post'),
            AUTH_SOCIAL_BROKER: app_main.host + '/Account/ExternalLogin',

            PURCHASE_TRANSPORTER_GET_ALLIANCE: url('/Transporter/GetAllianceByName'),
            DICTIONARY_ALL_COUNTRIES: url('/Dictionary/Country'),

            eof: null
        }
    })