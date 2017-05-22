angular.module('innaApp.controllers')
    .controller('AuthSignInCtrl', [
        'RavenWrapper',
        '$scope',
        'Validators',
        'AuthDataProvider',
        '$rootScope',
        'innaAppApiEvents',
        function (RavenWrapper, $scope, Validators, AuthDataProvider, $rootScope, Events) {
            function validate() {
                Validators.defined($scope.username, 'username');
                Validators.defined($scope.password, 'password');
            }

            function signIn() {
                var dataSingIn = {
                    Email: $scope.username,
                    Password: $scope.password,
                    RememberMe: $scope.rememberMe.toString()
                };

                AuthDataProvider.signIn(dataSingIn,
                    function (data) { //success
                        RavenWrapper.raven({
                            captureMessage: 'SignIn: OK!',
                            dataResponse: data,
                            dataRequest: dataSingIn
                        });

                        //analytics
                        track.loginSuccess();

                        $scope.$emit(Events.AUTH_SIGN_IN, data);
                    }, function () { //error
                        RavenWrapper.raven({
                            captureMessage: 'SignIn: ERROR SERVER',
                            dataResponse: 'error',
                            dataRequest: dataSingIn
                        });
                        $scope.$apply(function ($scope) {
                            $scope.requestFailure = true;
                        });
                    });
            }

            /*Properties*/
            $scope.username = '';

            $scope.$watch('username', function () {
                $scope.errors.username = false;
            });

            $scope.password = '';

            $scope.$watch('password', function () {
                $scope.errors.password = false;
            });

            $scope.rememberMe = true;

            $scope.errors = {};

            $scope.requestFailure = false;

            /*Methods*/
            $scope.signIn = function () {
                try {
                    validate();

                    //if ok
                    signIn();
                } catch (fieldName) {
                    RavenWrapper.raven({
                        captureMessage: 'SignIn VALIDATION: ERROR',
                        dataResponse: null,
                        dataRequest: fieldName
                    });
                    $scope.errors[fieldName] = true;
                }
            };

            $scope.switchRememberMe = function () {
                $scope.rememberMe = !$scope.rememberMe;
            }
        }
    ]);