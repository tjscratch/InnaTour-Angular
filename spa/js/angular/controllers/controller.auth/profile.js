angular.module('innaApp.controllers')
    .controller('AuthProfileCtrl', [
        '$scope', 'AuthDataProvider', 'Validators',
        function($scope, AuthDataProvider, Validators){
            /*Private*/
            function validate(){
                var isFilled = function(field) {
                    try {
                        Validators.defined(field, false);

                        return true;
                    } catch(e) {
                        return false;
                    }
                }

                if(isFilled($scope.user.raw.Phone)) {
                    Validators.phone($scope.user.raw.Phone, 'phone');
                }
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
                    AuthDataProvider.changeInfo($scope.user.raw, function(resp){
                        $scope.$apply(function($scope){
                            $scope.close();
                        });
                    });
                } catch(e) {
                    $scope.errors[e] = true;
                }
            };

            $scope.allowChangePassword = function(){
                $scope.state.allowChangePassword = true;
            };

            console.log('AuthProfileCtrl', $scope.user);
        }
    ]);