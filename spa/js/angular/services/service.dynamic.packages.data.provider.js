innaAppServices.factory('DynamicPackagesDataProvider', [
    '$http', '$timeout',
    function($http, $timeout){
        var FROM_SUGGEST = 'http://api.test.inna.ru/api/v1/Packages/From';
        var TO_SUGGEST = 'http://api.test.inna.ru/api/v1/Packages/To';

        function getListByTerm(url, term, callback) {
            $http({
                method: 'GET',
                params: {term: term},
                url: url,
            }).success(function(data){
                callback(data);
            });
        }

        return {
            getFromListByTerm: function(term, callback) {
                getListByTerm(FROM_SUGGEST, term, callback);
            },
            getToListByTerm: function(term, callback) {
                getListByTerm(TO_SUGGEST, term, callback);
            },
            getObjectById: function(id, callback){
                //TODO
                callback({
                    Name: 'Test Ok',
                    Id: id
                });
            },
            getLocation: function(callback){
                //TODO

                $timeout(function(){ callback(25); }, 500); // 25 is the fish! it's not a "magic" number

                return null;
            }
        }
    }
]);