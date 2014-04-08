angular.module('innaApp.controllers')
    .controller('AuthSignInCtrl', [
        '$scope', 'Validators', 'AuthDataProvider', '$rootScope', '$http',
        function($scope, Validators, AuthDataProvider, $rootScope, $http){
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

            $scope.signInWith = function(method){
                var brokerWindow = window.open(AuthDataProvider.socialBrockerURL(method), "width=300;height=300", "SocialBrocker");

                brokerWindow.focus();

                $(window).on('inna.Auth.SocialBroker.Result', function(event, data){
                    console.log(data);
                });
            }
        }
    ]);