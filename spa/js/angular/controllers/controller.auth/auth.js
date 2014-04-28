angular.module('innaApp.controllers')
    .controller('AuthCtrl', [
        '$scope', '$location', 'innaApp.API.events', 'AuthDataProvider', 'innaApp.Urls',
        function($scope, $location, Events, AuthDataProvider, app){
            $scope.restoreToken = ($location.path() == app.URL_AUTH_RESTORE) && $location.search().token;
            $scope.signUpToken = ($location.path() == app.URL_AUTH_SIGNUP) && $location.search().token;

            console.log('AuthCtrl: restore', $scope.restoreToken);
            console.log('AuthCtrl: signup', $scope.signUpToken);

            $scope.DISPLAY_SIGNIN = 1;
            $scope.DISPLAY_FORGOTTEN = 2;
            $scope.DISPLAY_SIGNUP = 3;

            $scope.display = $scope.DISPLAY_SIGNIN;

            if($scope.restoreToken) {
                $scope.display = $scope.DISPLAY_FORGOTTEN;
                $scope.$root.isLoginPopupOpened = true;
            } else if($scope.signUpToken) {
                $scope.display = $scope.DISPLAY_SIGNUP;
                $scope.$root.isLoginPopupOpened = true;
            }


            $scope.$on(Events.AUTH_FORGOTTEN_LINK_CLICKED, function(){
                $scope.display = $scope.DISPLAY_FORGOTTEN;
            });

            $scope.close = function(){
                $scope.$root.isLoginPopupOpened = false;
                $scope.display = $scope.DISPLAY_SIGNIN;
            }

            $scope.signInWith = function(method){
                var brokerWindow = window.open(AuthDataProvider.socialBrockerURL(method), "width=300;height=300", "SocialBrocker");

                brokerWindow.focus();

                $('#social-broker-listener').on('inna.Auth.SocialBroker.Result', function(event, data){
                    console.log('inna.Auth.SocialBroker.Result!');
                    console.log(data);
                });
            }
        }
    ])