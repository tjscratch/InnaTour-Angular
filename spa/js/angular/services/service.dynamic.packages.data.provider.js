innaAppServices.factory('DynamicPackagesDataProvider', [
    'innaApp.API.const', '$http', '$timeout',
    function(api, $http, $timeout){
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
                http(api.DYNAMIC_FROM_SUGGEST, {term: term}, callback);
            },
            getToListByTerm: function(term, callback) {
                http(api.DYNAMIC_TO_SUGGEST, {term: term}, callback);
            },
            getObjectById: function(id, callback){
                http(api.DYNAMIC_GET_OBJECT_BY_ID, {id: id}, callback);
            },
            getUserLocation: function(callback){
                //TODO

                $timeout(function(){ callback(25); }, 500); // 25 is the fish! it's not a "magic" number

                return null;
            }
        }
    }
]);