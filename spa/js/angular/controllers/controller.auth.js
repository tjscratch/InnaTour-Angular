angular.module('innaApp.controllers')
    .controller('AuthCtrl', [
        '$scope', '$location',
        function($scope, $location){
            $scope.hasPasswordRestoreToken = ($location.path() == app.URL_AUTH_RESTORE && !!$location.search().token);

            $scope.restoreToken = $scope.hasPasswordRestoreToken && $location.search().token;

            console.log('AuthCtrl:token=%s', $scope.restoreToken);
        }
    ])