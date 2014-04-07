angular.module('innaApp.controllers')
    .controller('AuthSignInCtrl', [
        '$scope', 'Validators', 'AuthDataProvider', '$rootScope',
        function($scope, Validators, AuthDataProvider, $rootScope){
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

            $scope.password = '';

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
            }
        }
    ]);