angular.module('innaApp.controllers')
    .controller('AuthSignInCtrl', [
        '$scope', 'Validators', 'AuthDataProvider', '$rootScope', 'innaApp.API.events',
        function($scope, Validators, AuthDataProvider, $rootScope, Events){
            function validate() {
                Validators.defined($scope.username, 'username');
                Validators.defined($scope.password, 'password');
            }

            function signIn(){
                AuthDataProvider.signIn({
                    Email: $scope.username,
                    Password: $scope.password
                }, function(data){ //success
                    console.log(data);
                    $rootScope.$broadcast('inna.Auth.SignIn');
                }, function(){ //error
                    $scope.requestFailure = true;
                });
            }

            /*Properties*/
            $scope.username = '';

            $scope.$watch('username', function(){
                $scope.errors.username = false;
            });

            $scope.password = '';

            $scope.$watch('password', function(){
                $scope.errors.password = false;
            });

            $scope.rememberMe = true;

            $scope.errors = {};

            $scope.requestFailure = false;

            /*Methods*/
            $scope.signIn = function(){
                try {
                    validate();

                    //if ok
                    signIn();
                } catch(fieldName) {
                    $scope.errors[fieldName] = true;
                }
            };

            $scope.forgotten = function(){
                $scope.$emit(Events.AUTH_FORGOTTEN_LINK_CLICKED);
            }

            $scope.switchRememberMe = function(){
                $scope.rememberMe = !$scope.rememberMe;
            }
        }
    ]);