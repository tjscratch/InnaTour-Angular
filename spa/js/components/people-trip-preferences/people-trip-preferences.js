innaAppDirectives.directive('peopleTripPreferences', ['$templateCache', function($templateCache) {
    return {
        restrict: 'E',
        template: $templateCache.get('components/people-trip-preferences/templ/people-trip-preferences.html'),
        replace: true,
        scope: {
            adultCount: '=',
            childrenCount: '=',
            infantsCount: '=',
            childrensAge: '=',
            klassModel: '=',
            typePage: '='
        },
        controller: function ($scope) {
            $scope.isOpen = false;
            $scope.isOpenChildrenList = false;
            $scope.isEnableAddChildren = true;

            $scope.maxAdultCountAvia = 6;
            $scope.maxAdultCountNoAvia = 4;

            $scope.maxPlace = 6;

            if($scope.typePage == 'DP' || $scope.typePage == 'Avia') {
                $scope.isLongStyle = {
                    width: 217 + 'px'
                }
                $scope.isLongStyleOpenBlock = {
                    width: 100 + '%'
                }
            } else {
                $scope.isLongStyle = {
                    width: 119 + 'px'
                }
                $scope.isLongStyleOpenBlock = {
                    width: 180 + 'px'
                }
            }

            $scope.range = _.generateRange;

            $scope.openBlock = function () {
                $scope.isOpen = true;
            };

            $scope.closeBlock = function () {
                $scope.isOpen = false;
                $scope.isOpenChildrenList = false;
            }

            $scope.plusAdult = function ($event) {
                // console.log('adultCount', $scope.adultCount);
                // console.log('infantsCount', getChildrenAndInfants().infantsCount);
                // console.log('$scope.childrensAge.length', $scope.childrensAge.length);
                // if($scope.typePage == 'Avia') {
                //     if(($scope.adultCount == 5) && (getChildrenAndInfants().infantsCount == 0) && ($scope.childrensAge.length == 1)) {
                //         return;
                //     } else {
                //         if($scope.adultCount + 1 <= $scope.maxAdultCountAvia) {
                //             $scope.adultCount += 1;
                //             getChildrenAndInfants();
                //         }
                //     }
                // } else {
                //     if(($scope.adultCount == 3) && (getChildrenAndInfants().infantsCount == 0) && ($scope.childrensAge.length == 3)) {
                //         return;
                //     } else {
                //         if($scope.adultCount + 1 <= $scope.maxAdultCountNoAvia) {
                //             $scope.adultCount += 1;
                //         }
                //     }
                // }
                addPeoples();
            };

            $scope.minusAdult = function ($event) {
                if($scope.adultCount != 1) {
                    $scope.adultCount -= 1;
                }
            };

            $scope.isOpenChildren = function () {
                $scope.isOpenChildrenList = !$scope.isOpenChildrenList;
            };
            
            $scope.addChildren = function (age) {
                if($scope.typePage == 'Avia') {
                    validationPeople(age);
                } else {
                    if($scope.childrensAge.length <= 3) {
                        validationPeople(age);
                        // console.log('addChildren', $scope.childrenCount);
                        $scope.childrenCount = $scope.childrensAge.length;
                    }
                }
            };

            function addPeoples(typePeoples, typeOperation, age) {
                if(typePeoples == 'Adult' && (typeOperation == 'Plus' || typeOperation == 'Minus')) {
                    if(typeOperation == 'Plus') {

                    }
                    if(typeOperation == 'Minus') {

                    }
                }
            };

            $scope.onChoose = function (option) {
                $scope.klassModel = option;
            };

            function validationPeople(age) {
                var summ = parseInt($scope.adultCount, 10) + parseInt(getChildrenAndInfants().childCount, 10) + parseInt(getChildrenAndInfants().infantsCount, 10);
                // console.log('===', summ);
                if(summ == $scope.maxPlace) {
                    if(age < 2) {
                        $scope.childrensAge.push({value: age});
                    }
                } else {
                    if(summ < 7) {
                        $scope.childrensAge.push({value: age});
                    }
                }
                getChildrenAndInfants();
            };

            function getChildrenAndInfants() {
                var childCount = 0;
                var infantsCount = 0;
                angular.forEach($scope.childrensAge, function (item) {
                    if(item.value >= 2) {
                        childCount++;
                        // console.log('childCount', childCount);
                    } else {
                        infantsCount++;
                        // console.log('infantCount', infantsCount);
                    }
                });
                if($scope.typePage == 'Avia') {
                    $scope.childrenCount = childCount;
                    $scope.infantsCount = infantsCount;
                }
                var data = {
                    childCount: childCount,
                    infantsCount: infantsCount
                }
                return  data;
            }

            $scope.deleteChildren = function ($index) {
                $scope.childrensAge.splice($index, 1);
                $scope.childrenCount = $scope.childrensAge.length;
            };
            
            $scope.selectTripPreferences = function (data) {
                $scope.klassModel = data;
            };

            $scope.getPeopleCount = function () {
                if($scope.typePage == 'Avia') {
                    return parseInt($scope.adultCount, 10) + parseInt($scope.childrenCount, 10) + parseInt($scope.infantsCount, 10);
                } else {
                    return parseInt($scope.adultCount, 10) + parseInt($scope.childrenCount, 10);
                }
            };

            $scope.yearString = function (age) {
                  if(age == 1) {
                      return 'год';
                  } else if(age > 1 && age < 5) {
                      return 'года';
                  } else if(age == 0 || age > 4) {
                      return 'лет';
                  }
            };

            $scope.$watch('klassModel', function (newValue, oldValue) {

                if(newValue != oldValue) {
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data': {
                            'Category': $scope.typePage == 'DP' ? 'Packages' : 'Avia',
                            'Action': 'ServiceClass',
                            'Label': newValue.display == 'Эконом' ? 'Economy' : 'Business',
                            'Content': '[no data]',
                            'Context': '[no data]',
                            'Text': '[no data]'
                        }
                    };
                    //console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                }
            });

            // $scope.$watch('adultCount', function (newValue, oldValue) {
            //     if(newValue instanceof Error) {
            //         $scope.adultCount = oldValue;
            //     }
            // })
        }
    }
}]);