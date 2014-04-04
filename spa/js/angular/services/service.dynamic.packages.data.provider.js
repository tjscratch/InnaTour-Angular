innaAppServices.factory('DynamicPackagesDataProvider', [
    '$http', '$timeout',
    function($http, $timeout){
        var FROM_SUGGEST = 'http://api.test.inna.ru/api/v1/Packages/From';
        var TO_SUGGEST = 'http://api.test.inna.ru/api/v1/Packages/To';
        var OBJECT_BY_ID = 'http://api.test.inna.ru/api/v1/Packages/DirectoryById';

        function http(url, send, callback) {
            $http({
                method: 'GET',
                params: send,
                url: url,
            }).success(function(data){
                callback(data);
            });
        }

        return {
            getFromListByTerm: function(term, callback) {
                http(FROM_SUGGEST, {term: term}, callback);
            },
            getToListByTerm: function(term, callback) {
                http(TO_SUGGEST, {term: term}, callback);
            },
            getObjectById: function(id, callback){
                http(OBJECT_BY_ID, {id: id}, callback);
            },
            getUserLocation: function(callback){
                //TODO

                $timeout(function(){ callback(25); }, 500); // 25 is the fish! it's not a "magic" number

                return null;
            }
        }
    }
]);