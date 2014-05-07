angular.module('innaApp.controllers')
    .controller('AuthProfileCtrl', [
        '$scope', 'AuthDataProvider', 'Validators',
        function($scope, AuthDataProvider, Validators){
            /*Private*/
            function validate(){
                Validators.phone($scope.user.raw.Phone, 'phone');
            }

            /*Properties*/
            $scope.state = {
                allowChangePassword: false
            };

            $scope.errors = {};

            $scope.currentPassword = '';
            $scope.newPassword = '';
            $scope.newPassword2 = '';

            /*Methods*/
            $scope.save = function(){
                try {
                    validate();

                    //if ok
                    AuthDataProvider.changeInfo($scope.user.raw);
                } catch(e) {
                    $scope.errors[e] = true;
                }
            };

            $scope.allowChangePassword = function(){
                $scope.state.allowChangePassword = true;
            };
        }
    ]);