angular.module('innaApp.controllers')
    .controller('AuthCtrl', [
        '$scope', '$location', 'innaApp.API.events', 'AuthDataProvider', 'innaApp.Urls',
        function($scope, $location, Events, AuthDataProvider, app){
            /*Private*/
            function setUserInfo(data){
                $scope.safeApply(function(){
                    $scope.$root.user = new inna.Models.Auth.User(data);

                    if($scope.user.isAgency() && !$scope.user.raw.AgencyActive) {
                        $scope.logout();
                        $scope.baloon.error('Агентство отключено', 'Авторизация невозможна');
                    }
                });
            }

            /*Methods*/
            $scope.close = function(){
                $scope.isLoginPopupOpened = false;
                $scope.display = $scope.DISPLAY_SIGNIN;
            };

            $scope.logout = function () {
                var wasLoggedUser = $scope.$root.user;

                $scope.$root.user = null;

                AuthDataProvider.logout();

                $scope.$root.$bradcast(Events.AUTH_SIGN_OUT, wasLoggedUser.raw);
            };

            $scope.open = function(){
                $scope.isLoginPopupOpened = true;
            };

            $scope.signInWith = function(method){
                var brokerWindow = window.open(AuthDataProvider.socialBrockerURL(method), "width=300;height=300", "SocialBrocker");

                brokerWindow.focus();

                $('#social-broker-listener').on('inna.Auth.SocialBroker.Result', function(event, data){
                    AuthDataProvider.recognize(function(data){
                        $scope.$apply(function($scope){
                            setUserInfo(data);
                            $scope.close();
                        });
                    });
                });
            };

            $scope.showProfile = function(){
            	if($scope.user.isAgency()) {
            		window.location = $scope.B2B_HOST;
            		return;
            	}
            	
                $scope.open();
                $scope.display = $scope.DISPLAY_PROFILE;
            };

            $scope.forgotten = function(){
                $scope.display = $scope.DISPLAY_FORGOTTEN;
            };

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

            $scope.recognize = function(){
                AuthDataProvider.recognize(setUserInfo);
            }

            $scope.B2B_HOST = window.DEV && window.DEV_B2B_HOST || app_main.b2bHost;

            /*EventListeners*/
            $scope.$on(Events.AUTH_SIGN_IN, function (event, data) {
                $scope.safeApply(function(){
                    setUserInfo(data);
                    $scope.close();

                    if($scope.user.isAgency()) {
                        window.location = $scope.B2B_HOST;
                    }
                });
            });

            $scope.$on(Events.AUTH_SIGN_OUT, function(event, loggedOutUserData){
                if((new inna.Models.Auth.User(loggedOutUser)).isAgency()) {
                    window.location = '/';
                }
            });

            /*Initial*/
            $scope.recognize();
        }
    ]);