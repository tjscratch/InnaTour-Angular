angular.module('innaApp.controllers')
    .controller('AuthProfileCtrl', [
        '$scope', 'AuthDataProvider',
        function($scope, AuthDataProvider){
            /*Properties*/
            $scope.state = {
                allowChangePassword: false
            };

            $scope.currentPassword = '';
            $scope.newPassword = '';
            $scope.newPassword2 = '';

            /*Methods*/
            $scope.save = function(){
                AuthDataProvider.changeInfo($scope.user.raw);
            };

            $scope.allowChangePassword = function(){
                $scope.state.allowChangePassword = true;
            };
        }
    ]);