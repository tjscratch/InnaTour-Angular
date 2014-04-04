angular.module('innaApp.API', [])
    .factory('innaApp.API.const', function(){
        function url(s){
            return (app_main.host || 'http://api.test.inna.ru') + '/api/v1' + s;
        }

        return {
            DYNAMIC_FROM_SUGGEST: url('/Packages/From'),
            DYNAMIC_TO_SUGGEST: url('/Packages/To'),
            DYNAMIC_GET_OBJECT_BY_ID: url('/Packages/DirectoryById')
        }
    })