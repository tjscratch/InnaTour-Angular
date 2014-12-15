/**
 * Страница успешной покупки пакета
 *
 * use dateHelper
 *
 */
innaAppControllers.
    controller('PageBuySuccess', [
        '$scope',
        '$rootScope',
        '$templateCache',
        '$routeParams',
        '$filter',
        '$timeout',
        'paymentService',
        'urlHelper',
        'aviaHelper',
        'innaApp.Urls',
        '$locale',

        // components
        'Balloon',
        'ModelTicket',
        'ModelHotel',
        'ModelRecommendedPair',
        function ($scope, $rootScope, $templateCache, $routeParams, $filter, $timeout, paymentService, urlHelper, aviaHelper, innaAppUrls, $locale, Balloon,
                  ModelTicket, ModelHotel, ModelRecommendedPair) {
            //document.body.classList.add('lighten-theme');

            $scope.hotelToShowDetails = null;
            $scope.recommendedPair = new ModelRecommendedPair();
            var _balloon = new Balloon();

            $scope.model = {};
            $scope.settings = {
                height: 220,
                countColumn: 2,
                classBlock: 'buy__fly b-result_col_two b-result_middle'
            }

            $scope.partials = {
                collOneContent: 'ticket2ways',
                collTwoContent: 'hotel-info-bed-type',
                buyResult: 'pages/page-buy-success/templ/buy-result.html'
            };


            function showBalloonLoading(evt) {
                _balloon.updateView({
                    balloonClose: false,
                    template: 'loading.html'
                });
            }


            $scope.showBalloonTicket = function (evt) {
                if (evt) evt.preventDefault();

                // вызываем aviaHelper.tarifs
                var tarifs = new aviaHelper.tarifs()
                tarifs.fillInfo($scope.model.AviaInfo);
                tarifs.setected = tarifs.list[0];
                tarifs.setected.current = true;

                (new Balloon({
                    data: {
                        balloonPart: 'ticket-rules.html',
                        balloon_class: 'balloon_medium',
                        AviaInfo: $scope.model.AviaInfo,
                        tarifs: tarifs,
                        from: tarifs.setected.from,
                        to: tarifs.setected.to,
                        _RULE_: tarifs.setected.rule
                    }
                }).show());

            }

            $scope.showBalloonHotel = function (evt) {
                if (evt) evt.preventDefault();


                var hotelRules = new aviaHelper.hotelRules();
                hotelRules.fillData($scope.model.Hotel);

                (new Balloon({
                    data: {
                        balloonPart: 'hotel-rules.html',
                        balloon_class: 'balloon_ticket',
                        hotelRules: hotelRules
                    }
                }).show());
            }

            $scope.getHotelDetails = function () {

            }

            /**
             * Подготавливаем данные для шаблонов
             * @param {Object} data
             * @returns {*}
             */
            function parse(data) {
                var passengers = data.Passengers;

                data.PassengersData = {
                    adultCount: 0,
                    childCount: 0,
                    adult: '',
                    child: ''
                };

                
                data.AviaInfo.AirportFrom = data.AviaInfo.AirportToBack;
                data.AviaInfo.AirportTo = data.AviaInfo.AirportFromBack;
                data.AviaInfo.InCode = data.AviaInfo.OutCodeBack;
                data.AviaInfo.OutCode = data.AviaInfo.InCodeBack;

                // сколько взрослых и детей
                passengers.forEach(function (pass) {
                    var date = dateHelper.dateToJsDate(pass.Birthday);
                    pass.age = dateHelper.calculateAge(date);
                    if (pass.age >= 18) data.PassengersData.adultCount++;
                    if (pass.age < 18) data.PassengersData.childCount++;
                });

                if (window.partners && window.partners.isWL()) {
                    var partner = window.partners.getPartner();
                    data.phone = partner.phone;
                    data.email = partner.email;
                }
                else {
                    data.phone = '+7 (495) 742-12-12';
                    data.email = 'sale@inna.ru';
                }

                return data;
            }



            /** Получаем данные о покупке */
            (function () {
                showBalloonLoading();

                paymentService.getPaymentData({orderNum: $routeParams.OrderNum},
                    function (data) {

                        if (data) {
                            $scope.model = parse(data);
                            $scope.Hotel  = $scope.model.Hotel;
                            $scope.AviaInfo  = $scope.model.AviaInfo;

                            $scope.loadData = true;
                            $scope.ticket2ways = true;
                            $scope.partialInfoHotel = true;
                            $scope.orderNum = $routeParams.OrderNum;

                            $scope.recommendedPair.setTicket(new ModelTicket(data.AviaInfo));
                            $scope.recommendedPair.setHotel(new ModelHotel(data.Hotel));
                        }

                        $timeout(function () {
                            if (_balloon) {
                                _balloon.hide();
                            }
                        }, 1000);
                    },
                    function () {
                        _balloon.updateView({
                            balloonClose: true,
                            content: '<span></span>',
                            title: 'Пакет не найден',
                            template: 'err.html',
                            callbackClose: function () {
                                location.href = '/'
                            }
                        });
                    }
                );
            }())

            $scope.$on('$destroy', function () {
                document.body.classList.remove('lighten-theme');
            })
        }
    ]);
