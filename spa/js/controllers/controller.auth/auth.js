angular.module('innaApp.controllers')
    .controller('AuthCtrl', [
        '$scope',
        '$location',
        'innaApp.API.events',
        'AuthDataProvider',
        'innaApp.Urls',
        function($scope, $location, Events, AuthDataProvider, app){


            var setUserInfo = function(data){
                if(data && data["Email"]) {
                    Raven.setUserContext({
                        email: data["Email"],
                        id: data["Email"],
                        data : data
                    });
                }
                $scope.safeApply(function(){
                    $scope.$root.user = new inna.Models.Auth.User(data);

                    if($scope.$root.user.isAgency() && !$scope.user.raw.AgencyActive) {
                        $scope.logout();
                    }
                });
            }


            $scope.close = function(){
                $scope.isLoginPopupOpened = false;
                $scope.display = $scope.DISPLAY_SIGNIN;
            };

            $scope.logout = function () {
                var wasLoggedUser = $scope.$root.user;

                $scope.$root.user = null;

                AuthDataProvider.logout(onLogoutCompleteOrError, onLogoutCompleteOrError);

                function onLogoutCompleteOrError() {
                    $scope.$emit(Events.AUTH_SIGN_OUT, wasLoggedUser);
                }
            };

            $scope.open = function(){
                $scope.isLoginPopupOpened = true;
            };


            $scope.signInWith = function(method){

                var brokerWindow = window.open(AuthDataProvider.socialBrockerURL(method), "SocialBroker", "width=500,height=500,resizable=yes,scrollbars=no,status=no");

                brokerWindow.focus();

                var socialBrokerListener = $('#social-broker-listener');

                var interval = setInterval(function(){
                    var cookieCloser = localStorage.getItem('closeSocialBroker');

                    console.log('cookieCloser', cookieCloser);

                    if(cookieCloser) {
                        localStorage.setItem('closeSocialBroker', 0);

                        login();
                    }
                }, 100);

                var login = function(){
                    AuthDataProvider.recognize(function(data){
                        $scope.$apply(function($scope){
                            setUserInfo(data);
                            $scope.close();
                        });
                    });

                    clearInterval(interval);

                    socialBrokerListener.off('inna.Auth.SocialBroker.Result', login);
                };

                socialBrokerListener.on('inna.Auth.SocialBroker.Result', login);



                return false;
            };

            $scope.showProfile = function(){
            	if($scope.$root.user.isAgency()) {
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

                    if($scope.$root.user && $scope.$root.user.isAgency()) {
                        window.location = $scope.B2B_HOST;
                    }
                });
            });

            $scope.$on(Events.AUTH_SIGN_OUT, function(event, userRaw){
                var user = new inna.Models.Auth.User(userRaw.raw);

                if(user.isAgency() && !user.raw.AgencyActive) {
                    $scope.baloon.showErr('Агентство неактивно', 'Вход не возможен', function(){
                        window.location = '/';
                    });
                } else if(user.isAgency()) {

                    window.location = '/';
                }
            });

            /*Initial*/
            $scope.recognize();
        }
    ]);