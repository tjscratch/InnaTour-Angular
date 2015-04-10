innaAppDirectives.directive('biletixForm',
    function ($templateCache) {
        return {
            require: '^innaForm',
            restrict: 'E',
            template: function () {
                return $templateCache.get('components/partners/biletix/biletix_form.html')
            },
            controller: function ($element, $scope, $http, widgetValidators) {
                //console.log('biletix form init');

                //форма спрятана - тут показываем с задержкой, чтобы отработали стили и js
                setTimeout(function () {
                    document.getElementsByClassName('b-form-container')[0].style.visibility = 'visible';
                }, 500);

                //model
                $scope.ticketClass = 0;

                $scope.adultCount = 2;
                $scope.childCount = 0;
                $scope.childrensAges = [];

                $scope.childAge1 = 0;
                $scope.childAge2 = 0;
                $scope.childAge3 = 0;

                //даты
                $scope.startDate;
                $scope.endDate;

                $scope.startDateNextDisabled = true;
                $scope.startDatePrevDisabled = true;
                $scope.endDateNextDisabled = true;
                $scope.endDatePrevDisabled = true;

                $scope.updateDateNextPrev = function () {
                    $scope.startDateNextDisabled = !$scope.startDate;
                    $scope.startDatePrevDisabled = !$scope.startDate;
                    $scope.endDateNextDisabled = !$scope.endDate;
                    $scope.endDatePrevDisabled = !$scope.endDate;
                };

                $scope.$watchGroup(['startDate', 'endDate'], function (data) {
                    console.log('watch data', data);
                    $scope.updateDateNextPrev();
                });

                $scope.addSubscractDay = function (fromOrToDate, addOrSubstract) {
                    if (fromOrToDate == 'from'){

                    }
                };
                //даты

                function sendChildsUpdate(){
                    //обновляем данные в innForm
                    $scope.updateFormModel('childrensAge', [
                        {value: $scope.childAge1Enabled ? $scope.childAge1 : 0},
                        {value: $scope.childAge2Enabled ? $scope.childAge2 : 0},
                        {value: $scope.childAge3Enabled ? $scope.childAge3 : 0}
                    ]);
                }

                $scope.$watchGroup(['childAge1', 'childAge2', 'childAge3'], function (data) {
                    $scope.childrensAges = data;

                    //обновляем данные в innForm
                    sendChildsUpdate();
                });

                $scope.$watch('ticketClass', function (data) {
                    //обновляем данные в innForm
                    $scope.updateFormModel('ticketClass', data);
                });

                $scope.$watch('adultCount', function (data) {
                    //обновляем данные в innForm
                    $scope.updateFormModel('adultCount', data);
                });

                $scope.$watch('childCount', function (data) {
                    $scope.childAge1Enabled = $scope.childCount > 0;
                    $scope.childAge2Enabled = $scope.childCount > 1;
                    $scope.childAge3Enabled = $scope.childCount > 2;

                    //обновляем данные в innForm
                    $scope.updateFormModel('childrenCount', data);
                    sendChildsUpdate();
                });

                //ui
                //model

                //ui handlers
                $scope.adultClick = function (count) {
                    $scope.adultCount = count;
                };

                $scope.childClick = function (count) {
                    $scope.childCount = count;
                };

                $scope.submit = function () {
                    $scope.updateFormModel('submit');
                };
                //ui handlers

                //communicate
                //для обновления значений внутри innaForm
                $scope.setFormModel = { };

                $scope.updateFormModel = function (attr, value) {
                    $scope.setFormModel = { attr: attr, value: value };
                };

                //для обновления UI при изменениях в innaForm
                $scope.exportFieldsArray = [
                    'locationFrom', 'locationTo', 'startDate', 'endDate',
                    'ticketClass', 'adultCount', 'childrenCount', 'childrensAge'
                ];

                $scope.exportFieldsChange = function (values) {
                    //console.log('from innaForm', values);
                    for(var i=0; i< values.length; i++){
                        $scope[$scope.exportFieldsArray[i]] = values[i];
                    }
                };
                //communicate
            }
        }
    });
