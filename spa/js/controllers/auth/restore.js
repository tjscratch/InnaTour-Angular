angular.module('innaApp.controllers')
    .controller('AuthPwdRerstoreCtrl_A', [
        '$scope',
        'Validators',
        'AuthDataProvider',
        function($scope, Validators, AuthDataProvider) {
            function validate() {
                Validators.email($scope.email, 'email');
            }

            function sendToken() {
                AuthDataProvider.sendToken({
                    Email: $scope.email
                }, function () { //success
                    //analytics
                    track.requestPassword();

                    $scope.$apply(function($scope){
                        $scope.showLanding = true;
                    });
                }, function(){ //error
                    $scope.$apply(function($scope){
                        $scope.requestFailure = true;
                    });
                });
            }

            /*Properties*/
            $scope.email = '';

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
        '$scope',
        'Validators',
        'AuthDataProvider',
        '$timeout',
        '$location',
        function($scope, Validators, AuthDataProvider, $timeout, $location){
            function validate() {
                Validators.defined($scope.password, 'password');
                Validators.minLength($scope.password, 6, 'passwordMinLength');
                Validators.equals($scope.password, $scope.password2, 'password2');
            }

            function setNewPassword(){
                //console.log('setNewPassword');

                AuthDataProvider.setNewPassword($scope.restoreToken, {
                    newPassword: $scope.password,
                    confirmPassword: $scope.password2
                }, function(){
                    $scope.$apply(function($scope){
                        $scope.success = true;

                        $timeout(function(){
                            document.location = '/';
                        }, 1500);
                    });
                }, function(){
                    $scope.$apply(function($scope){
                        $scope.requestFailed = true;
                    });
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
                } catch(fieldName) {
                    $scope.errors[fieldName] = true;

                    return;
                }

                //if ok
                setNewPassword();
            };

            $scope.hasError = function(fieldName) {
                if($scope.errors[fieldName]) return 'error';

                return '';
            }
        }
    ]);