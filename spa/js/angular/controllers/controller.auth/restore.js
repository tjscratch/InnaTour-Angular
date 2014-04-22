angular.module('innaApp.controllers')
    .controller('AuthPwdRerstoreCtrl_A', [
        '$scope', 'Validators', 'AuthDataProvider',
        function($scope, Validators, AuthDataProvider) {
            function validate() {
                Validators.email($scope.email, 'email');
            }

            function sendToken() {
                AuthDataProvider.sendToken({
                    Email: $scope.email
                }, function(){ //success
                    $scope.showLanding = true;
                }, function(){ //error
                    $scope.requestFailure = true;
                });
            }

            /*Properties*/
            $scope.email = 'user@example.com';

            $scope.$watch('email', function(){
                $scope.errors.email = false;
                $scope.requestFailure = false;
            });

            $scope.errors = {};

            $scope.requestFailure = false;

            $scope.showLanding = false;

            /*Methods*/
            $scope.sendToken = function(){
                try {
                    validate();

                    //if ok
                    sendToken();
                } catch(fieldName) {
                    $scope.errors[fieldName] = true;
                }
            }
        }
    ])
    .controller('AuthPwdRerstoreCtrl_B', [
        '$scope', 'Validators', 'AuthDataProvider', '$timeout', '$location',
        function($scope, Validators, AuthDataProvider, $timeout, $location){
            function validate() {
                Validators.defined($scope.password, 'password');
                Validators.minLength($scope.password, 6, 'passwordMinLength');
                Validators.equals($scope.password, $scope.password2, 'password2');
            }

            function setNewPassword(){
                AuthDataProvider.setNewPassword($scope.restoreToken, {
                    newPassword: $scope.password,
                    confirmPassword: $scope.password2
                }, function(){
                    $scope.success = true;

                    $timeout(function(){
                        $location.path('/');
                    }, 1500);
                }, function(){
                    $scope.requestFailed = true;
                });
            }

            /*Properties*/
            $scope.password = '';

            $scope.$watch('password', function(){
                $scope.errors.password = false;
                $scope.errors.passwordMinLength = false;
            });

            $scope.password2 = '';

            $scope.$watch('password2', function(){
                $scope.errors.password2 = false;
            });

            $scope.errors = {}

            $scope.requestFailed = false;

            $scope.success = false;

            /*Methods*/
            $scope.setNewPassword = function(){
                try {
                    validate();

                    //if ok
                    setNewPassword();
                } catch(fieldName) {
                    $scope.errors[fieldName] = true;
                }
            }
        }
    ]);