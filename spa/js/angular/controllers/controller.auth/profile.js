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

                if($scope.state.allowChangePassword) {
                    Validators.defined($scope.currentPassword, 'currentPassword');
                    Validators.defined($scope.newPassword, 'emptyPassword');
                    Validators.minLength($scope.newPassword, 6, 'passwordMinLength');
                    Validators.equals($scope.newPassword, $scope.newPassword2, 'passwordNotMatch')
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

            $scope.$watch('currentPassword', function(){
                $scope.errors.currentPassword = false;
            });

            $scope.$watch('newPassword', function(){
                $scope.errors.emptyPassword = false;
                $scope.errors.passwordMinLength = false;
            });

            $scope.$watch('newPassword2', function(){
                $scope.errors.passwordNotMatch = false;
            });

            /*Methods*/
            $scope.save = function(){
                try {
                    validate();

                    //if ok
                    var requests = [];

                    requests.push(AuthDataProvider.changeInfo($scope.user.raw));

                    if($scope.state.allowChangePassword) {
                        requests.push(AuthDataProvider.changePassword({
                            OldPassword: $scope.currentPassword,
                            NewPassword: $scope.newPassword,
                            ConfirmPassword: $scope.newPassword2
                        }));
                    }


                    $.when.apply($, requests).then(function(){
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
        }
    ]);