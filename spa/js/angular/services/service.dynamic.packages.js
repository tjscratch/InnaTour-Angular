innaAppServices.factory('DynamicPackagesDataProvider', [
    '$http',
    function($http){
        var FROM_SUGGEST = 'http://api.test.inna.ru/api/v1/Packages/From/Get';
        var TO_SUGGEST = 'http://api.test.inna.ru/api/v1/Packages/To/Get';

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
            }
        }
    }
]);