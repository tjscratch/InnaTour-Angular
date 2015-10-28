/**
 * На маркерах карты создаем  infoBox двух разных типов
 * Это preview infoBox и полноценный infoBox с информацией и фотографиями
 * При этом не создаются новые экземпляры классов InfoBox,
 * прячем и показываем снова один созданный тип  InfoBox
 *
 */

angular.module('innaApp.directives')
    .directive('hotelsMap', [
        'EventManager',
        '$templateCache',
        'innaAppApiEvents',
        '$routeParams',
        '$location',
        'innaApp.Urls',
        function (EventManager, $templateCache, Events, $routeParams, $location, Urls) {

            return {
                template: $templateCache.get('components/map/templ/index.html'),
                replace: true,
                scope: {
                    hotels: '=hotels',
                    hotelsForMap: '=mapHotels',
                    airports: '=',
                    recommendedPair: '=recommendedPair'
                },
                controller: [
                    'EventManager',
                    '$scope',
                    '$element',
                    'innaAppApiEvents',

                    function (EventManager, $scope, $element, Events) {
                        if (window.partners) {
                            window.partners.setFixedContentHeight();
                        }

                        /* прячем кнопку - отзывы и предложения */
                        $('#reformal_tab').hide();

                        $scope.currentHotel = null;
                        $scope.currentHotelPreview = null;
                        $scope.airMarker = null;

                        document.documentElement.style.overflow = 'hidden';


                        function mapSizeMini() {
                            $scope.mapSize = true
                        }

                        function mapSizeBig() {
                            $scope.mapSize = false
                        }

                        EventManager.on(Events.DYNAMIC_SERP_OPEN_BUNDLE, mapSizeBig);
                        EventManager.on(Events.DYNAMIC_SERP_CLOSE_BUNDLE, mapSizeMini);

                        EventManager.fire(Events.DYNAMIC_SERP_CLOSE_BUNDLE);
                        EventManager.fire(Events.DYNAMIC_SERP_MAP_LOAD, true);


                        $scope.hotelDetails = function (currentHotel) {
                            EventManager.fire(Events.DYNAMIC_SERP_MORE_DETAIL_HOTEL, $scope.hotels.search(currentHotel.HotelId));
                        }

                        $scope.$on('$destroy', function () {
                            if (window.partners) {
                                window.partners.setAutoContentHeight();
                            }

                            $('#reformal_tab').show();
                            document.documentElement.style.overflow = 'auto';
                            EventManager.fire(Events.DYNAMIC_SERP_MAP_DESTROY);
                            EventManager.off(Events.DYNAMIC_SERP_OPEN_BUNDLE, mapSizeBig);
                            EventManager.off(Events.DYNAMIC_SERP_CLOSE_BUNDLE, mapSizeMini);
                        })
                    }
                ],
                link: function (scope, elem, attrs) {

                    scope.chosenHotel = null;
                    scope.chosenHotelActive = null;
                    var $thisEl = elem[0];
                    var mapContainer = $thisEl.querySelector('#big-map-canvas');
                    var boxPreview = $thisEl.querySelector('.big-map__balloon_preview');
                    var boxPhoto = $thisEl.querySelector('.big-map__balloon');
                    var boxAir = $thisEl.querySelector('.big-map__balloon_air');

                    var markers = [];
                    var zoomMapDefault = 12;
                    var carouselInit = false;
                    var _markerCluster = null;
                    var iconAirDefault = 'spa/img/map/marker-black-air.png?' + Math.random().toString(16);
                    var iconAirClick = 'spa/img/map/marker-black-air.png?' + Math.random().toString(16);
                    var iconDefault = 'spa/img/map/pin-grey.png?' + Math.random().toString(16);
                    var iconHover = 'spa/img/map/pin-black.png?' + Math.random().toString(16);
                    var iconCluster = 'spa/img/map/pin-circle.png?' + Math.random().toString(16);
                    var iconHoverCluster = 'spa/img/map/pin-circle-black.png?' + Math.random().toString(16);
                    var iconClick = 'spa/img/map/pin-green.png?' + Math.random().toString(16);
                    var activeMarker = null;
                    var activeMarkerHover = null;
                    var GM = google.maps;
                    var HotelGalleryComponent = null;
                    var _bounds = new GM.LatLngBounds();
                    var dataInfoBox = {
                        //visible: false,
                        disableAutoPan: false,
                        closeBoxURL: "",
                        //pixelOffset: new google.maps.Size(-10, 0),
                        zIndex: 2000,
                        infoBoxClearance: new google.maps.Size(1, 1),
                        pane: "floatPane",
                        enableEventPropagation: false
                    };
                    var boxInfo = null;
                    var boxInfoHover = null;
                    var boxInfoAir = null;
                    var styleArray = [
                        {
                            featureType: "all",
                            stylers: [
                                { saturation: -30 }
                            ]
                        },
                        {
                            featureType: "road.arterial",
                            elementType: "geometry",
                            stylers: [
                                { hue: "#00ffee" },
                                { saturation: 50 }
                            ]
                        },
                        {
                            featureType: "poi.business",
                            elementType: "labels",
                            stylers: [
                                { visibility: "off" }
                            ]
                        }
                    ];

                    var map = new GM.Map(mapContainer, {
                        center: new GM.LatLng(0, 0),
                        mapTypeControl: true,
                        mapTypeControlOptions: {
                            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                            position: google.maps.ControlPosition.TOP_RIGHT
                        },
                        panControl: false,
                        zoomControlOptions: {
                            style: google.maps.ZoomControlStyle.LARGE,
                            position: google.maps.ControlPosition.LEFT_TOP
                        },
                        styles: styleArray,
                        zoom: 8
                    });

                    /** Событие обновления фильтров */
                    EventManager.on(Events.LIST_PANEL_FILTES_HOTELS_DONE, updateMap);
                    EventManager.on(Events.LIST_PANEL_FILTES_RESET_DONE, updateMap);

                    GM.event.addListener(map, 'click', function (evt) {
                        activeMarkerReset();
                    });

                    /*GM.event.addListener(map, 'zoom_changed', function() {
                     console.log(map.getZoom(), 'zoom');
                     });*/

                    scope.setHotel = function (currentHotel) {
                        if (scope.chosenHotelActive) {
                            scope.chosenHotelActive.setIcon(iconDefault);
                            scope.chosenHotelActive.setZIndex(0);
                        }
                        scope.chosenHotelActive = scope.chosenHotel;
                        scope.chosenHotelActive.setIcon(iconClick);
                        scope.chosenHotelActive.setZIndex(3000);

                        EventManager.fire(Events.DYNAMIC_SERP_CHOOSE_HOTEL, scope.hotels.search(currentHotel.HotelId));
                    }


                    function setActiveMarker(data_marker) {
                        var data = data_marker.marker;

                        //console.log(data);
                        // создаем свойство в объекте маркера
                        // различаем маркеры на которых был click или hover
                        if (data.hover) {
                            activeMarkerHover = data.activeMarker;
                            if (data.infoBoxPreview) data.activeMarker.infoBoxPreview = true;
                        }
                        else if (!data.hover && !data.air) {
                            activeMarker = data.activeMarker;
                            if (data.infoBoxVisible) data.activeMarker.infoBoxVisible = true;

                            /**
                             * Строим URL для страницы подробнее об отеле
                             * :DepartureId-:ArrivalId-:StartVoyageDate-:EndVoyageDate-:TicketClass-:Adult-:Children-:HotelId-:TicketId-:ProviderId?
                             *
                             * searchParams -  добавляется в каждую карточку отеля в компоненте list-panel:parse
                             */
                            scope.computedUrlDetails = function () {
                                var routParam = angular.copy($routeParams);

                                var ticketId = scope.recommendedPair.ticket.data.VariantId1;
                                var ticketBackId = scope.recommendedPair.ticket.data.VariantId2;


                                var urlDetails = '/#' + Urls.URL_DYNAMIC_HOTEL_DETAILS + [
                                    routParam.DepartureId,
                                    routParam.ArrivalId,
                                    routParam.StartVoyageDate,
                                    routParam.EndVoyageDate,
                                    routParam.TicketClass,
                                        routParam.Adult || 0,
                                        routParam.Children || '',
                                    data.activeMarker.$inna__hotel.HotelId,
                                    ticketId,
                                    ticketBackId,
                                    data.activeMarker.$inna__hotel.ProviderId
                                ].join('-');

                                if (window.partners && window.partners.isFullWL()) {
                                    urlDetails = window.partners.getParentLocationWithUrl(urlDetails);
                                }

                                return urlDetails;
                            }
                        }
                    }

                    function activeMarkerReset() {
                        if (activeMarker && activeMarker.infoBoxVisible) {

                            /** сбрасываем цвет маркера */

                            if (!scope.chosenHotelActive || (activeMarker._idHotel != scope.chosenHotelActive._idHotel)) {
                                activeMarker.setIcon(iconDefault);
                            }


                            boxInfo.setVisible(false);

                            activeMarker.infoBoxVisible = false;
                        }
                    }
                    // прокидываем метод в scope для закрытия infoBox
                    scope.activeMarkerReset = activeMarkerReset;

                    /**
                     * Анимация
                     * @param marker
                     */
                    var toggleBounce = function (marker) {
                        if (marker.getAnimation() != null) {
                            marker.setAnimation(null);
                        } else {
                            marker.setAnimation(GM.Animation.BOUNCE);
                        }
                    }

                    var reDraw = function (box) {
                        var oldDraw = box.draw;
                        box.draw = function () {
                            oldDraw.apply(this);
                            jQuery(box.div_).hide();
                            jQuery(box.div_).fadeIn(200);
                        }
                    }

                    /**
                     *
                     * @param data
                     */
                    var addInfoBox = function (data) {
                        var dataMarker = data.marker;
                        data.infoBoxData = dataInfoBox;

                        angular.extend(dataInfoBox, {
                            content: data.elem,
                            position: data.pos
                        });

                        // инфобокс - hover
                        if (dataMarker.hover) {
                            if (!boxInfoHover) {
                                boxInfoHover = new InfoBox(dataInfoBox);
                                boxInfoHover.open(map);

                            } else {
                                boxInfoHover.setPosition(data.pos);
                                boxInfoHover.setVisible(true);
                            }


                            // инфобокс для аэропорта
                        } else if (dataMarker.air) {
                            if (!boxInfoAir) {
                                boxInfoAir = new InfoBox(dataInfoBox);
                                boxInfoAir.open(map);

                            } else {
                                boxInfoAir.setPosition(data.pos);
                                boxInfoAir.setVisible(true);
                            }

                            // инфобокс на клик маркера отеля
                        } else {
                            if (boxInfoHover) {
                                boxInfoHover.setVisible(false);
                            }
                            if (!boxInfo) {
                                //dataInfoBox.pixelOffset = new google.maps.Size(10, -20);
                                boxInfo = new InfoBox(dataInfoBox);
                                boxInfo.open(map);
                                boxInfo.setZIndex(3000);
                                reDraw(boxInfo);
                            } else {
                                boxInfo.setVisible(true);
                                boxInfo.setPosition(data.pos);
                                boxInfo.setZIndex(3000);
                            }
                        }
                        setActiveMarker(data);
                    }


                    /**
                     * Добавить маркер
                     * @param hotel
                     * @returns {{marker: GM.Marker, pos: GM.LatLng}}
                     */
                    var addMarker = function (data_for_marker) {
                        var data = data_for_marker;
                        var position = new GM.LatLng(data.Latitude, data.Longitude);

                        var image = new GM.MarkerImage(
                            (data.type == 'hotel') ? iconDefault : iconAirDefault
                            //new google.maps.Size(55, 46),
                            //new google.maps.Point(0, 0)
                            //new google.maps.Point(0, 46)
                        );

                        var shape = {
                            coord: [1, 1, 1, 43, 32, 43, 32 , 1],
                            type: 'poly'
                        };

                        var marker = new GM.Marker({
                            position: position,
                            //animation: GM.Animation.DROP,
                            icon: image,
                            map: map,
                            //shape: shape,
                            title: (data.HotelName) ? data.HotelName : ''
                        });
                        return  {
                            marker: marker,
                            pos: position
                        }
                    }


                    /**
                     * Удалить маркер
                     * removeMarkers
                     */
                    var removeMarkers = function () {
                        markers.forEach(function (marker) {
                            marker.setMap(null);
                        });
                        markers = [];

                        if (_markerCluster)
                            _markerCluster.clearMarkers();
                    }

                    /**
                     * Добавить маркер группировки
                     * addCluster
                     */
                    var addCluster = function () {
                        _markerCluster = new MarkerClusterer(map, markers, {
                            zoom : 5,
                            maxZoom : 14,
                            gridSize: 20,
                            //clusterClass : 'big-map__cluster',
                            styles: [
                                {
                                    url: iconCluster,
                                    height: 50,
                                    width: 50,
                                    anchor: [16, 0],
                                    textColor: '#ffffff',
                                    textSize: 12,
                                    fontWeight: 'normal'
                                }
                            ]
                        });

                        //console.log(_markerCluster.getTotalMarkers(), _markerCluster.getTotalClusters());

                        zoomMapDefault = map.getZoom();
                        /*GM.event.addListener(_markerCluster, 'mouseover', function (c) {
                         })

                         GM.event.addListener(_markerCluster, 'mouseover', function (c) {

                         })*/
                    }

                    var clearSelection = function () {
                        if (window.getSelection) {
                            window.getSelection().removeAllRanges();
                        } else { // старый IE
                            document.selection.empty();
                        }
                    }


                    /**
                     * События маркера на карте
                     * @param data
                     */
                    var markerEvents = function (data) {

                        var marker = data.marker;
                        var pos = data.pos;

                        GM.event.addListener(marker, 'dblclick', clearSelection);

                        GM.event.addListener(marker, 'click', function () {
                            var marker = this;

                            var pos = this.getPosition();

                            scope.$apply(function ($scope) {
                                $scope.currentHotel = angular.copy(marker.$inna__hotel);
                                scope.chosenHotel = marker;
                            });

                            // ценрируем карту
                            map.panTo(pos);

                            // если уже есть активный маркер, то сбрасываем его
                            activeMarkerReset();
                            // меняем цвет маркера
                            //marker.setIcon(iconClick);

                            // Показываем большой infoBox
                            addInfoBox({
                                elem: boxPhoto,
                                pos: pos,
                                marker: {
                                    activeMarker: marker,
                                    infoBoxVisible: true,
                                    hover: false
                                }
                            });
                        });

                        GM.event.addListener(marker, 'mouseover', function () {
                            var marker = this;
                            clearSelection();

                            if (!marker.infoBoxVisible) {
                                scope.$apply(function ($scope) {
                                    $scope.currentHotelPreview = angular.copy(marker.$inna__hotel);
                                });

                                marker.setIcon(iconHover);

                                addInfoBox({
                                    elem: boxPreview,
                                    pos: pos,
                                    marker: {
                                        activeMarker: marker,
                                        infoBoxPreview: true,
                                        hover: true
                                    }
                                });
                            }
                        });

                        GM.event.addListener(marker, 'mouseout', function () {
                            var marker = this;
                            if (!marker.infoBoxVisible) {
                                boxInfoHover.setVisible(false);
                                if (scope.chosenHotelActive) {
                                    if (marker._idHotel != scope.chosenHotelActive._idHotel) {
                                        marker.setIcon(iconDefault);
                                    } else {
                                        marker.setIcon(iconClick);
                                    }
                                } else {
                                    marker.setIcon(iconDefault);
                                }

                            }
                        });
                    }

                    /**
                     * События маркера для аэропортов
                     * @param data
                     */
                    var markerAirEvents = function (data) {
                        var marker = data.marker;
                        var pos = data.pos;

                        GM.event.addListener(marker, 'mouseover', function () {
                            var marker = this;

                            scope.$apply(function ($scope) {
                                $scope.airport = marker.$airport;
                            });

                            marker.setIcon(iconAirClick);

                            addInfoBox({
                                elem: boxAir,
                                pos: pos,
                                marker: {
                                    activeMarker: marker,
                                    air: true,
                                    hover: false
                                }
                            });

                        });

                        GM.event.addListener(marker, 'mouseout', function () {
                            var marker = this;
                            boxInfoAir.setVisible(false);
                            marker.setIcon(iconAirDefault);
                        });
                    }


                    function showOneHotel(data_hotel) {

                        // проходм по всем маркерам
                        markers.filter(function (marker) {

                            // сравниваем и находим нужный
                            if ((marker.$inna__hotel && marker.$inna__hotel.Latitude) &&
                                (marker.$inna__hotel.Latitude == data_hotel.Latitude)) {


                                scope.$apply(function ($scope) {
                                    $scope.currentHotel = marker.$inna__hotel;
                                });

                                // меняем иконку
                                marker.setIcon(iconClick);

                                // инициализируем infoBox
                                addInfoBox({
                                    elem: boxPhoto,
                                    pos: marker.getPosition(),
                                    marker: {
                                        activeMarker: marker,
                                        infoBoxVisible: true,
                                        hover: false
                                    }
                                });

                                var bounds = new GM.LatLngBounds();
                                var position = new GM.LatLng(data_hotel.Latitude, data_hotel.Longitude);

                                bounds.extend(position);

                                map.fitBounds(bounds);
                                map.setZoom(15);

                                map.panTo(marker.getPosition());

                                return marker;
                            }
                        });
                    }

                    function setDefaultActiveMarker() {
                        markers.forEach(function (marker) {
                            if (scope.recommendedPair.hotel.data.HotelId == marker._idHotel) {
                                scope.chosenHotel = marker;
                                scope.chosenHotelActive = marker;
                                scope.chosenHotelActive.setIcon(iconClick);
                                scope.chosenHotelActive.setZIndex(3000);
                            }
                        })
                    }

                    function updateMap(data) {
                       if (boxInfo) {
                            boxInfo.setVisible(false);
                            //map.setZoom(zoomMapDefault);
                        }

                        var hotels = (data.hotels) ? data.hotels : data;
                        var airports = (data.airports) ? data.airports : [];

                        var rawHotels = (hotels.toJSON) ? hotels.toJSON() : hotels;
                        removeMarkers();

                        rawHotels.forEach(function (hotel) {

                            var hotelRaw = hotel;

                            if (!hotelRaw.Latitude || !hotelRaw.Longitude) return;

                            var markerData = addMarker(angular.extend(hotelRaw, { type: 'hotel' }));
                            var marker = markerData.marker;

                            marker.$inna__hotel = hotelRaw;
                            marker._idHotel = hotelRaw.HotelId;

                            marker._hotelId_ = hotelRaw.HotelId;

                            markerEvents(markerData);
                            _bounds.extend(markerData.pos);
                            markers.push(marker);
                        });


                        // TODO: сейчас не приходят аэропорта
                        airports.forEach(function (airport) {
                            airport.data = airport;
                            angular.extend(airport, { type: 'airport' });

                            if (!airport.Latitude || !airport.Longitude) return;

                            var markerData = addMarker(airport);
                            var marker = markerData.marker;
                            marker.$airport = airport;
                            markerAirEvents(markerData);
                            markers.push(marker);
                        });

                        setDefaultActiveMarker();

                        // отключил кластеризацию, если в будущем будут проблемы с производительностью
                        // надо будет возвращать обратно и что то придумывать для выделения текущей точки
                        //addCluster();
                    }

                    /**
                     * Переход с карточки отеля
                     */
                    var offMapSingle = scope.$on(Events.DYNAMIC_SERP_TOGGLE_MAP_SINGLE, function (evt, data) {
                        if (data) {
                            showOneHotel((data.toJSON) ? data.toJSON() : data);
                        }
                    });


                    /**
                     * Следим за свойством hotelsForMap
                     *
                     * Прокидываем событие в serp.js
                     * и дальше меняем свойство в $scope
                     *
                     * Это действие выполняется если мы отфильтровали набор на странице списка
                     * и потом перешли на карту, нам нужен уже фильтрованый набор данных
                     *
                     *
                     * тоже самое можно сделать на angular через emit - broadcast
                     */
                    var stopWatchHotels = scope.$watchCollection('hotelsForMap', function (newValue, oldValue) {
                        if (newValue != undefined && newValue.length) {
                            updateMap({
                                hotels: newValue,
                                airports: scope.airports
                            });
                            map.fitBounds(_bounds);
                        }
                    });



                    /**
                     * IN-5387
                     * показ блока с ценой за человека
                     */
                    scope.CostPerPersonShow = true;


                    //destroy
                    scope.$on('$destroy', function () {
                        //stopWatchHotelsAir();
                        stopWatchHotels();
                        offMapSingle();

                        EventManager.off(Events.LIST_PANEL_FILTES_HOTELS_DONE, updateMap);
                        EventManager.off(Events.LIST_PANEL_FILTES_RESET_DONE, updateMap);
                        EventManager.off(Events.DYNAMIC_SERP_TOGGLE_MAP, updateMap);
                        EventManager.off(Events.DYNAMIC_SERP_GO_TO_MAP, showOneHotel);

                        removeMarkers();

                        GM.event.addListener(map);
                        GM = null;
                        _bounds = null;
                        map = null;
                        boxInfoHover = null;
                        boxInfo = null;
                        boxInfoAir = null;
                        dataInfoBox = null;
                    })
                }
            }
        }]);
