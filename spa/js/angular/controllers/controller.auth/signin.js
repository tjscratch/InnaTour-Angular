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
                }, function(data, state, jqXHR){ //success
                    if(!$scope.rememberMe) {
                        //todo IN-845
                    }
                }, function(){ //error
                    //TODO move it into SUCCESS
                    //Danis will make it later
                    var fishData = {displayName: 'Константин Константинопольский', userpic: 'http://lh.inna.ru:8182/spa/img/borat.png'};
                    $scope.$emit(Events.AUTH_SIGN_IN, fishData);


                    $scope.$apply(function($scope){
                        $scope.requestFailure = true;
                    });
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