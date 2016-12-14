angular.module('innaApp.controllers')
    .controller('DynamicReserveTicketsCtrl', [
        'RavenWrapper',
        '$scope',
        '$controller',
        '$routeParams',
        '$location',
        '$rootScope',
        'serviceCache',
        'DynamicFormSubmitListener',
        'DynamicPackagesDataProvider',
        'aviaHelper',
        'paymentService',
        'innaApp.Urls',
        'storageService',
        'urlHelper',
        '$timeout',
        'PromoCodes',
        
        '$templateCache',
        //components
        'Balloon',
        '$cookieStore',
        '$q',
        'gtm',
        'dataService',
        'AppRouteUrls',
        'Transfer',
        '$filter',
        function (RavenWrapper, $scope, $controller, $routeParams, $location, $rootScope, serviceCache, DynamicFormSubmitListener, DynamicPackagesDataProvider, aviaHelper, paymentService, Urls, storageService, urlHelper, $timeout, PromoCodes, $templateCache, Balloon, $cookieStore, $q, gtm, dataService, AppRouteUrls, Transfer, $filter) {
            
            $scope.baloon.showExpireCheck();
            
            Raven.setExtraContext({key: "__RESERVATION_CONTEXT__"});
            
            // TODO : наследование контроллера
            $controller('ReserveTicketsCtrl', {$scope: $scope});
            
            if ($scope.isAgency() || (window.partners && window.partners.isWL())) {
            }
            else {
                //тоолько для B2C
                //и не на WL
                $scope.isRequestEnabled = true;
            }

            $scope.isMainPromoCode = true;
            $scope.isRosneftKomandaCard = false;
            if(window.partners.partner) {
                if (window.partners.partner.name == 'komandacard') {
                    $scope.isMainPromoCode = false;
                    $scope.isRosneftKomandaCard = true;
                }
            }

            /*----------------- INIT -------------------*/
            
            var children = $routeParams.Children ?
                _.partition($routeParams.Children.split('_'), function (age) {
                    return age >= 2;//до 2 лет - инфант, с двух - уже child
                }) :
                [
                    [],
                    []
                ];
            
            var searchParams = angular.copy($routeParams);
            
            searchParams.StartVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.StartVoyageDate);
            searchParams.EndVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.EndVoyageDate);
            searchParams.Children && (searchParams.ChildrenAges = searchParams.Children.split('_'));
            
            if ($location.search().hotel) searchParams['HotelId'] = $location.search().hotel;
            if ($location.search().ticket) searchParams['TicketId'] = $location.search().ticket;
            if ($location.search().room) searchParams['RoomId'] = $location.search().room;
            
            //дата до - для проверки доков
            $scope.expireDateTo = null;
            if (searchParams.EndVoyageDate) {
                $scope.expireDateTo = dateHelper.apiDateToJsDate(searchParams.EndVoyageDate);
            }
            else {
                $scope.expireDateTo = dateHelper.apiDateToJsDate(searchParams.StartVoyageDate);
            }
            
            $scope.searchParams = searchParams;
            $scope.combination = {};
            $scope.fromDate = $routeParams.StartVoyageDate;
            $scope.AdultCount = parseInt($routeParams.Adult);
            $scope.ChildCount = children[0].length;
            $scope.Child = children[0];
            $scope.InfantsCount = children[1].length;
            $scope.peopleCount = $scope.AdultCount + $scope.ChildCount + $scope.InfantsCount;
            
            $scope.ticketsCount = aviaHelper.getTicketsCount($scope.AdultCount, $scope.ChildCount, $scope.InfantsCount);
            $scope.popupItemInfo = new aviaHelper.popupItemInfo($scope.ticketsCount, $routeParams.TicketClass);
            
            $scope.gtmDetailsAviaInReserv = function () {
                var dataLayerObj = {
                    'event': 'UM.Event',
                    'Data' : {
                        'Category': 'Packages',
                        'Action'  : 'DetailsAviaInReserv',
                        'Label'   : '[no data]',
                        'Content' : '[no data]',
                        'Context' : '[no data]',
                        'Text'    : '[no data]'
                    }
                };
                console.table(dataLayerObj);
                if (window.dataLayer) {
                    window.dataLayer.push(dataLayerObj);
                }
            };
            
            $scope.gtmDetailsHotelsInReserv = function () {
                var dataLayerObj = {
                    'event': 'UM.Event',
                    'Data' : {
                        'Category': 'Packages',
                        'Action'  : 'DetailsHotelsInReserv',
                        'Label'   : '[no data]',
                        'Content' : '[no data]',
                        'Context' : '[no data]',
                        'Text'    : '[no data]'
                    }
                };
                console.table(dataLayerObj);
                if (window.dataLayer) {
                    window.dataLayer.push(dataLayerObj);
                }
            };
            
            $scope.gtmRules = function ($event, type) {
                var label = '';
                switch (type) {
                    case 'avia':
                        label = 'ConditionAvia';
                        break;
                    case 'hotel':
                        label = 'ConditionHotels';
                        break;
                    case 'insurance':
                        label = 'ConditionMedical';
                        break;
                    case 'oferta':
                        label = 'Oferta';
                        break;
                    case 'iata':
                        label = 'IATA';
                        break;
                    case 'tkp':
                        label = 'TKP';
                        break;
                    case 'tariffs':
                        label = 'Tariffs';
                        break;
                    default:
                        break;
                }
                var dataLayerObj = {
                    'event': 'UM.Event',
                    'Data' : {
                        'Category': 'Packages',
                        'Action'  : label,
                        'Label'   : $event.target.textContent,
                        'Content' : '[no data]',
                        'Context' : '[no data]',
                        'Text'    : '[no data]'
                    }
                };
                console.table(dataLayerObj);
                if (window.dataLayer) {
                    window.dataLayer.push(dataLayerObj);
                }
            };
            
            $scope.$watch('validationModel.wannaNewsletter.value', function (newValue, oldValue) {
                if (newValue != undefined && oldValue != undefined) {
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data' : {
                            'Category': 'Packages',
                            'Action'  : 'WantEmails',
                            'Label'   : newValue ? 'Select' : 'UnSelect',
                            'Content' : '[no data]',
                            'Context' : '[no data]',
                            'Text'    : '[no data]'
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                }
            });
            
            $scope.$watch('agree', function (newValue, oldValue) {
                // console.log('oV', oldValue);
                // console.log('nV', newValue);
                if (newValue != undefined) {
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data' : {
                            'Category': 'Packages',
                            'Action'  : 'AcceptConditions',
                            'Label'   : newValue ? 'Select' : 'UnSelect',
                            'Content' : '[no data]',
                            'Context' : '[no data]',
                            'Text'    : '[no data]'
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                }
            });
            
            $scope.$watch('addition.isNeededVisa', function (newValue, oldValue) {
                // console.log('oV', oldValue);
                // console.log('nV', newValue);
                if (newValue != undefined && oldValue != undefined) {
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data' : {
                            'Category': 'Packages',
                            'Action'  : 'Visa',
                            'Label'   : newValue ? 'Select' : 'UnSelect',
                            'Content' : '[no data]',
                            'Context' : '[no data]',
                            'Text'    : '[no data]'
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                }
            });
            
            $scope.$watch('addition.isNeededTransfer', function (newValue, oldValue) {
                // console.log('oV', oldValue);
                // console.log('nV', newValue);
                if (newValue != undefined && oldValue != undefined) {
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data' : {
                            'Category': 'Packages',
                            'Action'  : 'Transfer',
                            'Label'   : newValue ? 'Select' : 'UnSelect',
                            'Content' : '[no data]',
                            'Context' : '[no data]',
                            'Text'    : '[no data]'
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                }
            });
            
            
            $scope.cityFrom = null;
            $scope.cityTo = null;
            $scope.PackagePrice = null;
            $scope.HotelName = null;
            
            
            /**
             * Трекаем события для GTM
             * https://innatec.atlassian.net/browse/IN-7071
             */
            $q.all([
                dataService.getLocationById(searchParams.DepartureId),
                dataService.getLocationById(searchParams.ArrivalId)]
            ).then(function (results) {
                var resCheck = serviceCache.getObject('ResCheck');
                var PackagePrice = resCheck ? resCheck.PackagePrice : 0;
                var HotelName = resCheck ? resCheck.HotelName : '';
                gtm.GtmTrack(
                    {
                        'PageType' : 'PackagesReservationCheck',
                        'Price'    : PackagePrice ? PackagePrice : '[no data]',
                        'HotelName': HotelName ? HotelName : '[no data]'
                    },
                    {
                        'CityFrom'      : results[0].data.Location.City.Code,
                        'CityTo'        : results[1].data.Location.City.Code,
                        'DateFrom'      : searchParams.StartVoyageDate,
                        'DateTo'        : searchParams.EndVoyageDate,
                        'Travelers'     : searchParams.Adult + '-' + ('Children' in searchParams ? searchParams.Children.split('_').length : '0'),
                        'TotalTravelers': 'Children' in searchParams ?
                        parseInt(searchParams.Adult) + searchParams.Children.split('_').length
                            : searchParams.Adult,
                        'ServiceClass'  : searchParams.TicketClass == 0 ? 'Economy' : 'Business'
                    }
                );
            });
            
            
            //:DepartureId-:ArrivalId-:StartVoyageDate-:EndVoyageDate-:TicketClass-:Adult-:Children?-:HotelId-:TicketId-:TicketBackId-:ProviderId
            $scope.getHotelInfoLink = function (ticketId, ticketBackId, hotelId, providerId) {
                var url = '/#' + Urls.URL_DYNAMIC_HOTEL_DETAILS +
                    [
                        $routeParams.DepartureId,
                        $routeParams.ArrivalId,
                        $routeParams.StartVoyageDate,
                        $routeParams.EndVoyageDate,
                        $routeParams.TicketClass,
                        $routeParams.Adult,
                        $routeParams.Children > 0 ? $routeParams.Children : '',
                        hotelId,
                        ticketId,
                        ticketBackId,
                        providerId
                    ].join('-');
                
                if (window.partners && window.partners.isFullWL()) {
                    url = window.partners.getParentLocationWithUrl(url);
                }
                
                return url;
            };
            
            function addition() {
                var self = this;
                this.customerWishlist = '';
                this.isNeededVisa = false;
                this.isNeededTransfer = false;
                this.isNeededMedicalInsurance = false;
            }
            
            
            function goToSearch() {
                var url = $scope.goBackUrl().replace('/#', '');
                $location.url(url);
            }
            
            //http://lh.inna.ru/#/packages/search/6733-6623-17.08.2015-23.08.2015-0-2-?hotel=397940&ticket=10000145429&display=tickets
            $scope.goBackUrl = function () {
                var url = '/#' + Urls.URL_DYNAMIC_PACKAGES_SEARCH +
                    [
                        $routeParams.DepartureId,
                        $routeParams.ArrivalId,
                        $routeParams.StartVoyageDate,
                        $routeParams.EndVoyageDate,
                        $routeParams.TicketClass,
                        $routeParams.Adult,
                        $routeParams.Children
                    ].join('-');
                return url;
            };
            
            
            function getCheckParams() {
                var qData = {
                    HotelId                  : $scope.hotel.HotelId,
                    HoteProviderId           : $scope.hotel.ProviderId,
                    Rooms                    : $location.search().room,
                    TicketToId               : $scope.item.VariantId1,
                    TicketBackId             : $scope.item.VariantId2,
                    TicketClass              : $routeParams.TicketClass,
                    'Filter[DepartureId]'    : $routeParams.DepartureId,
                    'Filter[ArrivalId]'      : $routeParams.ArrivalId,
                    'Filter[StartVoyageDate]': searchParams.StartVoyageDate,
                    'Filter[EndVoyageDate]'  : searchParams.EndVoyageDate,
                    'Filter[TicketClass]'    : $routeParams.TicketClass,
                    'Filter[Adult]'          : $routeParams.Adult
                };
                if ($routeParams.Children) {
                    var childs = $routeParams.Children.split('_');
                    qData['Filter[ChildrenAges]'] = [];
                    _.each(childs, function (age) {
                        qData['Filter[ChildrenAges]'].push(age);
                    });
                }
                return qData;
            }
            
            function successSearch(data) {
                $scope.$apply(function ($scope) {
                    
                    $scope.addition = new addition();
                    
                    //console.log('data:');
                    //console.log(data);
                    //дополняем полями
                    aviaHelper.addCustomFields(data.AviaInfo);
                    aviaHelper.addAggInfoFields(data.Hotel);
                    
                    
                    /**
                     * Трекаем события для GTM
                     * https://innatec.atlassian.net/browse/IN-7071
                     */
                    $q.all([
                        dataService.getLocationById(searchParams.DepartureId),
                        dataService.getLocationById(searchParams.ArrivalId)]
                    ).then(function (results) {
                        gtm.GtmTrack(
                            {
                                'PageType' : 'PackagesReservationLoad',
                                'Price'    : data.Price,
                                'HotelName': data.Hotel.HotelName
                            }
                        );
                        
                        serviceCache.createObj('PageType', 'Packages');
                        serviceCache.createObj('Price', data.Price);
                        serviceCache.createObj('HotelName', data.Hotel.HotelName);
                        
                    });
                    
                    
                    $scope.item = data.AviaInfo;
                    $scope.hotel = data.Hotel;
                    $scope.recommendedPair = {
                        hotel: {
                            data: data.Hotel
                        },
                        ticket: {
                            data: data.AviaInfo
                        },
                        priceReservation: data.Price
                    };
                    $scope.room = data.Hotel.Room;
                    $scope.price = data.Price;
                    $scope.NeedSmsValidation = data.NeedSmsValidation;
                    console.log('NeedSmsValidation - ' + $scope.NeedSmsValidation);
                    //$scope.NeedSmsValidation = true;
                    
                    //ищем страховку
                    $scope.isInsuranceIncluded = false;
                    (function getInsurance(included) {
                        if (included) {
                            var re = /Страховка/ig;
                            for (var i = 0; i < included.length; i++) {
                                var item = included[i];
                                if (re.test(item.Name)) {
                                    $scope.isInsuranceIncluded = true;
                                    break;
                                }
                            }
                        }
                    })(data.Included);
                    
                    //грузим тарифы
                    $scope.loadTarifs($scope.item.VariantId1, $scope.item.VariantId2, data.AviaInfo);
                    
                    
                    $scope.afterPayModelInit = function () {
                        $scope.baloon.hide();
                    };
                    
                    $scope.combination.Hotel = data.Hotel;
                    $scope.combination.Ticket = data.AviaInfo;
                    
                    $scope.Is_it_tarif = data.AviaInfo.ItTariff;
                });
            }
            
            function errorSearch(data, status) {
                $scope.safeApply(function () {
                    $scope.baloon.showNotFound("Вариант больше недоступен", "Вы будете направлены на результаты поиска",
                        function () {
                            $timeout.cancel($scope.tmId);
                            goToSearch();
                        });
                });
                
                $scope.tmId = $timeout(function () {
                    //очищаем хранилище для нового поиска
                    //storageService.clearAviaSearchResults();
                    $scope.baloon.hide();
                    //билеты не доступны - отправляем на поиск
                    goToSearch();
                }, 3000);
            }
            
            
            //http://lh.inna.ru/#/packages/reservation/6733-6623-01.11.2015-15.11.2015-0-2-2-97014-800125836-800125978-2?room=d13a0aef-28a4-7bef-9ff8-e0f5f5ef2ade&hotel=97014&ticket=800125836#SectionRoom
            //http://lh.inna.ru/#/packages/reservation/6733-6623-01.11.2015-15.11.2015-0-2--97014-800126499-800126604-2?room=f7a3259d-cc28-4d7e-3c44-7fcb3a6e70c8&hotel=97014&ticket=800126499#SectionRoom
            function goToAvia() {
                var url = Urls.URL_DYNAMIC_PACKAGES_SEARCH +
                    [
                        $routeParams.DepartureId,
                        $routeParams.ArrivalId,
                        $routeParams.StartVoyageDate,
                        $routeParams.EndVoyageDate,
                        $routeParams.TicketClass,
                        $routeParams.Adult,
                        $routeParams.Children > 0 ? $routeParams.Children : ''
                    ].join('-') + "?display=tickets&hotel=" + $scope.hotel.HotelId + "&ticket=" + $scope.item.VariantId1;
                $location.url(url);
            }
            
            
            function goToHotelDetails() {
                var detailsUrl = $scope.getHotelInfoLink($scope.item.VariantId1, $scope.item.VariantId2, $scope.hotel.HotelId, $scope.hotel.ProviderId);
                var url = detailsUrl.replace('/#', '');
                $location.url(url);
            }
            
            
            function noAvailability(data) {
                function showBaloon(text1, text2) {
                    $scope.safeApply(function () {
                        $scope.baloon.showNotFound(text1, text2,
                            function () {
                                $timeout.cancel($scope.tmId);
                                //goToSearch();
                            });
                    });
                }
                
                if (data != null) {
                    if (data.IsTicketAvailable == false) {
                        showBaloon("К сожалению, билеты на выбранный вариант уже недоступны.", "Пожалуйста, выберите новый вариант перелета")
                    }
                    if (data.Rooms != null && data.Rooms.length && data.Rooms[0].IsAvailable == false) {
                        showBaloon("К сожалению, выбранный номер уже недоступен.", "Пожалуйста, выберите другой тип номера или отель")
                    }
                }
                
                $scope.tmId = $timeout(function () {
                    //очищаем хранилище для нового поиска
                    storageService.clearAviaSearchResults();
                    $scope.baloon.hide();
                    //билеты не доступны - отправляем на поиск
                    //goToSearch();
                    if (data.IsTicketAvailable == false) {
                        goToAvia();
                    }
                    if (data.Rooms != null && data.Rooms.length && data.Rooms[0].IsAvailable == false) {
                        goToHotelDetails();
                    }
                }, 3000);
            }
            
            /**
             * проверяем, что остались билеты для покупки
             */
            function packageCheckAvailability() {
                var getCheckParamsRaven = getCheckParams();
                paymentService.packageCheckAvailability({
                    data   : getCheckParamsRaven,
                    success: function (data) {
                        if ((data != null && data.IsTicketAvailable == true) &&
                            (data.Rooms != null && data.Rooms.length) &&
                            (data.Rooms[0].IsAvailable == true && data.Rooms[0].RoomId.length)) {
                            //если проверка из кэша - то отменяем попап
                            //$timeout.cancel(availableChecktimeout);
                            $scope.roomId = data.Rooms[0].RoomId;
                            
                            //правила отмены отеля
                            $scope.hotelRules.fillData($scope.hotel);
                            
                            noAvailability(data);
                            //загружаем все
                            $scope.initPayModel();
                        }
                        else {
                            RavenWrapper.raven({
                                captureMessage: 'CHECK AVAILABILITY ROOMS: ERROR',
                                dataResponse  : data,
                                dataRequest   : getCheckParamsRaven
                            });
                            
                            //================analytics========================
                            //Страница оплаты. Ошибка проверки доступности пакета
                            track.dpPackageNotAvialable();
                            //================analytics========================
                            
                            //errorSearch();
                            noAvailability(data);
                        }
                    },
                    error  : function (data) {
                        RavenWrapper.raven({
                            captureMessage: 'CHECK AVAILABILITY ROOMS: SERVER ERROR',
                            dataResponse  : data.responseJSON,
                            dataRequest   : getCheckParamsRaven
                        });
                        
                        //================analytics========================
                        //Страница оплаты. Ошибка проверки доступности пакета
                        track.dpPackageNotAvialable();
                        //================analytics========================
                        
                        $scope.safeApply(function () {
                            $scope.showReserveError();
                        });
                    }
                });
            }
            
            
            /**
             * ----- INIT -------
             * Получаем данные об отеле
             */
            DynamicPackagesDataProvider.hotelDetails({
                data   : {
                    HotelId        : searchParams.HotelId,
                    HotelProviderId: searchParams.ProviderId,
                    TicketToId     : searchParams.TicketId,
                    TicketBackId   : searchParams.TicketBackId,
                    Filter         : searchParams,
                    Rooms          : true
                },
                success: successSearch,
                error  : errorSearch
            }).done(function (data) {
                if (data && !$scope.hotel) {
                    $scope.hotel = data.Hotel;
                }
                packageCheckAvailability()
            });
            
            
            DynamicFormSubmitListener.listen();
            
            $scope.objectToReserveTemplate = 'pages/page-reservations/templ/reserve-include.html';
            
            $scope.afterCompleteCallback = function () {
                //переходим на страницу оплаты
                //var url = Urls.URL_DYNAMIC_PACKAGES_BUY + $scope.OrderNum;
                var url = AppRouteUrls.URL_PAYMENT + $scope.OrderNum;
                $location.url(url);
            };
            
            $scope.getApiModel = function (data) {
                var m = {};
                m.I = data.name;
                m.F = data.secondName;
                m.O = data.oName;
                m.Email = data.email;
                m.Phone = data.phone;
                m.IsSubscribe = data.wannaNewsletter;
                
                var pasList = [];
                _.each(data.passengers, function (item) {
                    pasList.push($scope.getPassenger(item));
                });
                m.Passengers = pasList;
                
                //Children: "1_2"
                var childAgers = [];
                if ($routeParams.Children != null && $routeParams.Children.length > 0) {
                    _.each($routeParams.Children.split('_'), function (item) {
                        childAgers.push(item);
                    });
                }
                
                m.IsNeededVisa = $scope.addition.isNeededVisa;
                m.IsNeededTransfer = $scope.addition.isNeededTransfer;
                m.IsNeededMedicalInsurance = $scope.addition.isNeededMedicalInsurance;
                
                m.SearchParams = {
                    HotelId         : $scope.hotel.HotelId,
                    HotelProviderId : $scope.hotel.ProviderId,
                    TicketToId      : $scope.item.VariantId1,
                    TicketBackId    : $scope.item.VariantId2,
                    RoomId          : $scope.roomId,
                    Filter          : {
                        ProviderId     : $scope.hotel.ProviderId,
                        DepartureId    : $routeParams.DepartureId,
                        ArrivalId      : $routeParams.ArrivalId,
                        StartVoyageDate: $scope.searchParams.StartVoyageDate,
                        EndVoyageDate  : $scope.searchParams.EndVoyageDate,
                        TicketClass    : $routeParams.TicketClass,
                        Adult          : $routeParams.Adult,
                        ChildrenAges   : childAgers
                    },
                    CustomerWishlist: $scope.addition.customerWishlist
                };
                
                m.PartnerMarker = (window.partners && window.partners.partnerMarker) ? window.partners.partnerMarker : null;
                
                //partnerOperatorId
                m.partnerOperatorId = (window.partners && window.partners.partnerOperatorId) ? window.partners.partnerOperatorId : null;
                
                m.Agree = $scope.agree;
                
                if ($scope.promoCode) {
                    m.PromoCode = $scope.promoCode;
                    m.promoCodeString = m.PromoCode
                }

                if($scope.isRosneftKomandaCardActive && $scope.promoCodeRosneft) {
                    m.Loyality = {
                        CardNumber : $scope.promoCodeRosneft,
                        CardType : 'komandacard'
                    }
                }
                if ($scope.TransferKey) {
                    m.TransferKey = $scope.TransferKey;
                }
                return m;
            }
            
            
            /**
             * начало промо код
             *
             * CP-OGUM4-OR4JZM1
             */
            $scope.checkPromoCode = function () {
                var m = $scope.getApiModelForReserve();
                var checkPromoCodeParams = m.apiModel;
                PromoCodes.getPackagesDiscountedPrice(checkPromoCodeParams)
                    .success(function (data) {
                        $scope.promoCodeStatus = data.Status;
                        $scope.promoCodeDetailStatus = data.DetailStatus;
                        if ($scope.promoCodeStatus == 1) {
                            $scope.promoCodeSale = data.Details.PromoCode.rule_value;
                            $scope.price = data.Details.NewPrice;
                            
                            var dataLayerObj = {
                                'event': 'UM.Event',
                                'Data' : {
                                    'Category': 'Packages',
                                    'Action'  : 'ApplyPromocode',
                                    'Label'   : '[no data]',
                                    'Content' : '[no data]',
                                    'Context' : '[no data]',
                                    'Text'    : '[no data]'
                                }
                            };
                            console.table(dataLayerObj);
                            if (window.dataLayer) {
                                window.dataLayer.push(dataLayerObj);
                            }
                        }
                    })
            };

            $scope.promoCodeRosneft = '';

            $scope.checkPromoCodeRosneft = function () {
                var checkPromoCodeParams = {
                    number: $scope.promoCodeRosneft,
                    cardType: 'komandacard',
                    price: $scope.price
                };
                PromoCodes.getPackagesDiscountedPriceRosneft(checkPromoCodeParams)
                    .success(function (data) {
                        if (data.Result == "Success") {
                            $scope.bonusRosneft = data.Data;
                            $scope.isRosneftKomandaCardActive = true;
                            // var dataLayerObj = {
                            //     'event': 'UM.Event',
                            //     'Data' : {
                            //         'Category': 'Packages',
                            //         'Action'  : 'ApplyPromocode',
                            //         'Label'   : '[no data]',
                            //         'Content' : '[no data]',
                            //         'Context' : '[no data]',
                            //         'Text'    : '[no data]'
                            //     }
                            // };
                            // console.table(dataLayerObj);
                            // if (window.dataLayer) {
                            //     window.dataLayer.push(dataLayerObj);
                            // }
                        } else if (data.Result == "Error") {
                            console.log('Result', data.Result);
                            console.log('Data', data.Data);
                            $scope.promoCodeStatusRosneft = 'Error';
                            $scope.promoCodeErrorInfo = data.Data;
                            $scope.bonusRosneft = '';
                        }
                    })
            };
            /**
             * конец промо код
             */
            
            
            //бронируем
            $scope.reserve = function () {
                //console.log('$scope.reserve');
                var m = $scope.getApiModelForReserve();
                var model = m.model;
                var apiModel = angular.copy(m.apiModel);
                
                
                RavenWrapper.raven({
                    level         : 3,
                    captureMessage: 'START RESERVE PACKAGES',
                    dataRequest   : apiModel
                });
                
                
                paymentService.packageReserve({
                    data   : apiModel,
                    success: function (data) {
                        $cookieStore.remove('b2b_operator');
                        $scope.safeApply(function () {
                            //console.log('order: ' + angular.toJson(data));
                            if (data != null && data.OrderNum != null && data.OrderNum.length > 0 && data.Status != null && data.Status == 1 && data.OrderNum.length > 0) {
                                //сохраняем orderId
                                //storageService.setAviaOrderNum(data.OrderNum);
                                $scope.OrderNum = data.OrderNum;
                                
                                //аналитика
                                track.dpGoBuy();
                                
                                //WL partner
                                if ($scope.$root.user != null && $scope.$root.user.isWlAgency()) {
                                    //показываем сообщения
                                    if (data.HotelBooked) {
                                        $scope.baloon.show("Бронь успешно создана", "После оплаты, документы можно скачать в личном кабинете",
                                            aviaHelper.baloonType.success,
                                            function () {
                                                $location.path(Urls.URL_ROOT);
                                            });
                                    }
                                    else {
                                        $scope.baloon.show("Заявка на бронирование создана", "Бронирование будет осуществлено после оплаты",
                                            aviaHelper.baloonType.success,
                                            function () {
                                                $location.path(Urls.URL_ROOT);
                                            });
                                    }
                                }
                                else if ($scope.$root.user != null && $scope.$root.user.isAgency()) {
                                    $scope.goToB2bCabinet();
                                }
                                else {
                                    //сохраняем модель
                                    //storageService.setReservationModel(model);
                                    
                                    //успешно
                                    $scope.afterCompleteCallback();
                                }
                            }
                            else {
                                RavenWrapper.raven({
                                    level         : 2,
                                    captureMessage: 'RESERVE PACKAGES: ERROR',
                                    dataResponse  : data,
                                    dataRequest   : apiModel
                                });
                                //аналитика
                                track.dpReservationError();
                                
                                console.error('packageReserve: %s', angular.toJson(data));
                                $scope.showReserveError();
                            }
                        });
                    },
                    error  : function (data) {
                        $cookieStore.remove('b2b_operator');
                        RavenWrapper.raven({
                            level         : 6,
                            captureMessage: 'RESERVE PACKAGES: SERVER ERROR',
                            dataResponse  : data.responseJSON,
                            dataRequest   : apiModel
                        });
                        //аналитика
                        track.dpReservationError();
                        
                        $scope.safeApply(function () {
                            //ошибка
                            console.error('paymentService.reserve error');
                            $scope.showReserveError();
                        });
                    }
                });
            };
            
            $scope.showReserveError = function () {
                $scope.baloon.hide();
                
                
                new Balloon().updateView({
                    template     : 'server-error.html',
                    callbackClose: function () {
                        //отправляем на поиск пакетов
                        goToSearch();
                    }
                });
            };
            
            
            /**
             * begin transfers
             */
            $scope.includeTransfer = false;
            $scope.transfersShow = false;
            $scope.transferSingle = 0;
            $scope.includeTransferChange = function (data, transferSingle) {
                $scope.Transfers = null;
                if (data) {
                    Transfer.getTransfers(
                        {
                            HotelId           : $scope.hotel.InnaHotelId,
                            DeparturePointCode: $scope.combination.Ticket.InCode,
                            Adults            : $scope.combination.Ticket.AdultCount,
                            Children          : $scope.combination.Ticket.ChildCount,
                            Infants           : $scope.combination.Ticket.InfantCount,
                            Single            : (transferSingle == 1) ? true : false,
                            Arrival           : $filter('date')($scope.combination.Ticket.ArrivalDate, 'dd.MM.yyyy HH:mm'),
                            Departure         : $filter('date')($scope.combination.Ticket.BackDepartureDate, 'dd.MM.yyyy HH:mm'),
                        }
                    )
                        .then(
                            function (res) {
                                console.log(res.data)
                                if (res.data.Transfers) {
                                    $scope.transfersShow = true;
                                    $scope.Transfers = res.data.Transfers;
                                }
                            },
                            function (res) {
                                console.log('err')
                                console.log(res)
                            }
                        );
                }else{
                    $scope.addition.isNeededTransfer = false;
                    $scope.TransferKey = null;
                    $scope.transfer = null;
                    $scope.transfersShow = false;
                    $scope.includeTransfer = false;
                    $scope.priceInTransfer = null;
                }
            };
            $scope.TransferSelected = function (transfer) {
                $scope.addition.isNeededTransfer = true;
                $scope.TransferKey = transfer.Key;
                $scope.transfer = transfer;
                $scope.priceInTransfer = $scope.price + transfer.Price;
                $scope.transfersShow = true;
                $scope.includeTransfer = true;
            };
            $scope.transferInfo = [];
            $scope.openTransferInfo = function (index) {
                $scope.transferInfo[index] = !$scope.transferInfo[index];
            };
            /**
             * end transfers
             */
            
            
            
            $scope.$on('$destroy', function () {
                $scope.baloon.hide();
                $timeout.cancel($scope.tmId);
            });
        }
    ]);
