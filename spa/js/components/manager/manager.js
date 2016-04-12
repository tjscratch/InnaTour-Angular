innaAppDirectives.directive('manager', function ($templateCache, $interval, $timeout, ManagerService) {
    return {
        replace: true,
        template: $templateCache.get("components/manager/templ/index.html"),
        link: function ($scope, element, attrs) {
            var url = "//manager.inna.ru/";
            
            $scope.url = url;
            $scope.showChat = false;
            $scope.showChatManager = false;
            
            function setManager () {
                console.log('getManagerStatus')
                ManagerService.getManagerStatus()
                    .then(function (res) {
                        if (res) {
                            $scope.showChat = true;
                            $scope.stopFight();
                            $timeout(function () {
                                $scope.showChatManager = true;
                            }, 10000)
                        }
                    }, function (res) {
                        $scope.showChat = false;
                        $scope.showChatManager = false;
                    });
            }
            
            setManager();
            
            
            var stop;
            $scope.fight = function () {
                // Don't start a new fight if we are already fighting
                if (angular.isDefined(stop)) return;
                
                stop = $interval(function () {
                    setManager();
                }, 4000);
            };
            
            $scope.stopFight = function () {
                if (angular.isDefined(stop)) {
                    $interval.cancel(stop);
                    stop = undefined;
                }
            };
            
            $scope.fight();
            
            $scope.$on('$destroy', function () {
                // Make sure that the interval is destroyed too
                $scope.stopFight();
            });
            
            //fullWidth
            $scope.fullView = false;
            $scope.toggleFullWidth = function () {
                $scope.fullView = true;
                var managerContainer = $(".b-manager__container");
                $("body").append(managerContainer);
            };
            
            $scope.toggleFullWidthclose = function () {
                $scope.fullView = false;
                var managerContainer = $(".b-manager__container");
                $(".b-manager").append(managerContainer);
            };
            
        }
    }
});


innaAppDirectives.directive('managerWidget', function ($templateCache, $interval, $timeout, ManagerService) {
    return {
        replace: true,
        template: $templateCache.get("components/manager/templ/widget.html"),
        link: function ($scope, element, attrs) {
            var url = "//manager.inna.ru/";
            
            $scope.url = url;
            $scope.openWidget = false;
            $scope.openFullWidth = false;
            
            $scope.showChat = false;
            
            
            $scope.toggleOpenWidget = function () {
                $scope.openWidget = !$scope.openWidget;
                
                if (!$scope.openWidget) {
                    $scope.openFullWidth = false;
                }
            };
            
            //fullWidth
            $scope.toggleOpenFullWidth = function () {
                $scope.openFullWidth = !$scope.openFullWidth;
            };
            
            
            function setManager () {
                console.log('getManagerStatus widget')
                ManagerService.getManagerStatus()
                    .then(function (res) {
                        if (res) {
                            $scope.showChat = true;
                            $scope.stopFightWidget();
                        }
                    }, function (res) {
                        $scope.showChat = false;
                    });
            }
            
            setManager();
            
            var stopWidget;
            $scope.fightWidget = function () {
                // Don't start a new fightWidget if we are already fighting
                if (angular.isDefined(stopWidget)) return;
                
                stopWidget = $interval(function () {
                    setManager();
                }, 6000);
            };
            
            $scope.stopFightWidget = function () {
                if (angular.isDefined(stopWidget)) {
                    $interval.cancel(stopWidget);
                    stopWidget = undefined;
                }
            };
            
            $scope.fightWidget();
            
            
            $scope.$on('$destroy', function () {
                // Make sure that the interval is destroyed too
                $scope.stopFightWidget();
            });
        }
    }
});
