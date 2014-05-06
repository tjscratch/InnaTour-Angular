angular.module('innaApp.controllers')
    .controller('AuthCtrl', [
        '$scope', '$location', 'innaApp.API.events', 'AuthDataProvider', 'innaApp.Urls',
        function($scope, $location, Events, AuthDataProvider, app){
            /*Properties*/
            $scope.restoreToken = ($location.path() == app.URL_AUTH_RESTORE) && $location.search().token;
            $scope.signUpToken = ($location.path() == app.URL_AUTH_SIGNUP) && $location.search().token;

            $scope.DISPLAY_SIGNIN = 1;
            $scope.DISPLAY_FORGOTTEN = 2;
            $scope.DISPLAY_SIGNUP = 3;
            $scope.DISPLAY_PROFILE = 4;

            $scope.isLoginPopupOpened = false;

            $scope.display = $scope.DISPLAY_SIGNIN;

            if($scope.restoreToken) {
                $scope.display = $scope.DISPLAY_FORGOTTEN;
                $scope.open();
            } else if($scope.signUpToken) {
                $scope.display = $scope.DISPLAY_SIGNUP;
                $scope.open();
            }

            /*Methods*/
            $scope.close = function(){
                $scope.isLoginPopupOpened = false;
                $scope.display = $scope.DISPLAY_SIGNIN;
            };

            $scope.logout = function(){
                $scope.$root.user = null;

                AuthDataProvider.logout();
            };

            $scope.open = function(){
                $scope.isLoginPopupOpened = true;
            };

            $scope.signInWith = function(method){
                var brokerWindow = window.open(AuthDataProvider.socialBrockerURL(method), "width=300;height=300", "SocialBrocker");

                brokerWindow.focus();

                $('#social-broker-listener').on('inna.Auth.SocialBroker.Result', function(event, data){
                    console.log('inna.Auth.SocialBroker.Result!');
                    console.log(data);
                });
            };

            $scope.showProfile = function(){
                $scope.open();
                $scope.display = $scope.DISPLAY_PROFILE;
            }

            /*EventListeners*/
            $scope.$on(Events.AUTH_FORGOTTEN_LINK_CLICKED, function(){
                $scope.display = $scope.DISPLAY_FORGOTTEN;
            });

            $scope.$on(Events.AUTH_SIGN_IN, function(event, data) {
                $scope.$root.user = new inna.Models.Auth.User(data);

                $scope.close();
            });
        }
    ])