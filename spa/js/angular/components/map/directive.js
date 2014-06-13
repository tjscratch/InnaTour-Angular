/**
 * На маркерах карты создаем  infoBox двух разных типов
 * Это preview infoBox и полноценный infoBox с информацией и фотографиями
 * При этом не создаются новые экземпляры классов InfoBox,
 * прячем и показываем снова один созданный тип  InfoBox
 *
 */

angular.module('innaApp.directives')
    .directive('dynamicSerpMap', [
        '$templateCache',
        function ($templateCache) {

            return {
                template: $templateCache.get('components/map/templ/index.html'),
                replace: true,
                scope: {
                    hotels: '=dynamicSerpMapHotels',
                    airports: '=dynamicSerpMapAirports'
                },
                controller: [
                    '$scope',
                    '$element',
                    function ($scope, $element) {
                        $scope.currentHotel = null;
                        $scope.currentHotelPreview = null;
                        $scope.airMarker = null;

                        // прячем footer
                        $scope.$emit('region-footer:hide');
                        $scope.$emit('bundle:hidden');
                        $element.addClass('big-map_short');


                        $scope.$root.$on('header:hidden', function () {
                            $element.addClass('big-map_short')
                        });

                        $scope.$root.$on('header:visible', function () {
                            $element.removeClass('big-map_short')
                        });

                        $scope.setHotel = function (currentHotel) {
                            $scope.$emit('choose:hotel', $scope.hotels.search(currentHotel.HotelId));
                        }

                        $scope.hotelDetails = function (currentHotel) {
                            $scope.$emit('more:detail:hotel', $scope.hotels.search(currentHotel.HotelId));
                        }

                        $scope.$on('$destroy', function(){
                            $scope.$emit('region-footer:show');
                        })
                    }
                ],
                link: function (scope, elem, attrs) {

                    var $thisEl = elem[0];
                    var mapContainer = $thisEl.querySelector('#big-map-canvas');
                    var boxPreview = $thisEl.querySelector('.big-map__balloon_preview');
                    var boxPhoto = $thisEl.querySelector('.big-map__balloon');
                    var boxAir = $thisEl.querySelector('.big-map__balloon_air');

                    var markers = [];
                    var carouselInit = false;
                    var _markerCluster = null;
                    var iconAirDefault = 'spa/img/map/marker-black-air.png?' + Math.random().toString(16);
                    var iconAirClick = 'spa/img/map/marker-green-air.png?' + Math.random().toString(16);
                    var iconDefault = 'spa/img/map/pin-grey.png?' + Math.random().toString(16);
                    var iconHover = 'spa/img/map/pin-black.png?' + Math.random().toString(16);
                    var iconClick = 'spa/img/map/pin-green.png?' + Math.random().toString(16);
                    var activeMarker = null;
                    var activeMarkerHover = null;
                    var GM = google.maps;
                    var _bounds = new GM.LatLngBounds();
                    var dataInfoBox = {
                        disableAutoPan: false,
                        closeBoxURL: "",
                        pixelOffset: new google.maps.Size(-10, 0),
                        zIndex: 2000,
                        infoBoxClearance: new google.maps.Size(1, 1),
                        isHidden: false,
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
                        disableDefaultUI: true,
                        styles: styleArray,
                        zoom: 8
                    });

                    GM.event.addListener(map, 'click', function (evt) {
                        activeMarkerReset();
                    });

                    /*GM.event.addListener(map, 'zoom_changed', function() {
                     console.log(map.getZoom(), 'zoom');
                     });*/

                    function initCarousel() {

                        var carousel = $(boxPhoto).find('.b-carousel');
                        var photoList = scope.currentHotel.Photos;

                        carousel.innaCarousel({
                            photoList: photoList,
                            map: true,
                            size: 'Small',
                            style: {
                                width: 360,
                                height: 240
                            },
                            fn: 'init'
                        });

                    }

                    function setActiveMarker(data_marker) {
                        var data = data_marker.marker;

                        // создаем свойство в объекте маркера
                        // различаем маркеры на которых был click или hover
                        if (data.hover) {
                            activeMarkerHover = data.activeMarker;
                            if (data.infoBoxPreview) data.activeMarker.infoBoxPreview = true;
                        }
                        else {
                            activeMarker = data.activeMarker;
                            if (data.infoBoxVisible) data.activeMarker.infoBoxVisible = true;
                        }


                    }

                    function activeMarkerReset() {
                        if (activeMarker && activeMarker.infoBoxVisible) {
                            activeMarker.setIcon(iconDefault);
                            boxInfo.setVisible(false);
                            activeMarker.infoBoxVisible = false;
                        }
                    }


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
                            GM.event.addListener(boxInfoHover, 'domready', function () {
                                $(boxPreview).css('left', 'auto');
                            });

                            // инфобокс для аэропорта
                        } else if (dataMarker.air) {
                            if (!boxInfoAir) {
                                boxInfoAir = new InfoBox(dataInfoBox);
                                boxInfoAir.open(map);

                            } else {
                                boxInfoAir.setPosition(data.pos);
                                boxInfoAir.setVisible(true);
                            }
                            GM.event.addListener(boxInfoAir, 'domready', function () {
                                $(boxAir).css('left', 'auto');
                            });

                            // инфобокс на клик маркера отеля
                        } else {
                            if (boxInfoHover) {
                                boxInfoHover.setVisible(false);
                            }
                            if (!boxInfo) {
                                boxInfo = new InfoBox(dataInfoBox);
                                boxInfo.open(map);
                                reDraw(boxInfo);
                            } else {
                                boxInfo.setVisible(true);
                                boxInfo.setPosition(data.pos);
                            }
                            GM.event.addListener(boxInfo, 'domready', function () {
                                $(boxPhoto).css('left', 'auto');
                            });
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
                            (data.type == 'hotel') ? iconDefault : iconAirDefault,
                            new google.maps.Size(55, 46),
                            new google.maps.Point(0, 0)
                            //new google.maps.Point(0, 46)
                        );

                        var shape = {
                            coord: [1, 1, 1, 43, 32, 43, 32 , 1],
                            type: 'poly'
                        };

                        var marker = new GM.Marker({
                            position: position,
                            animation: GM.Animation.DROP,
                            icon: image,
                            shape: shape,
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
                            gridSize: 20,
                            //clusterClass : 'big-map__cluster',
                            styles: [
                                {
                                    url: 'spa/img/map/empty.png',
                                    height: 50,
                                    width: 50,
                                    anchor: [16, 0],
                                    textColor: '#ffffff',
                                    textSize: 12,
                                    fontWeight: 'normal'
                                }
                            ]
                        });
                    }

                    /**
                     * События маркера на карте
                     * @param data
                     */
                    var markerEvents = function (data) {
                        var marker = data.marker;
                        var pos = data.pos;

                        GM.event.addListener(marker, 'click', function () {
                            var marker = this;

                            var pos = this.getPosition();

                            scope.$apply(function ($scope) {
                                $scope.currentHotel = marker.$inna__hotel;
                            });

                            // ценрируем карту
                            map.panTo(pos);

                            // если уже есть активный маркер, то сбрасываем его
                            activeMarkerReset();
                            // меняем цвет маркера
                            marker.setIcon(iconClick);

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

                            initCarousel();

                        });

                        GM.event.addListener(marker, 'mouseover', function () {
                            var marker = this;

                            if (!marker.infoBoxVisible) {
                                scope.$apply(function ($scope) {
                                    $scope.currentHotelPreview = marker.$inna__hotel;
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
                            } else {

                            }
                        });

                        GM.event.addListener(marker, 'mouseout', function () {
                            var marker = this;
                            if (!marker.infoBoxVisible) {
                                boxInfoHover.setVisible(false);
                                marker.setIcon(iconDefault);
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
                                    air: true
                                }
                            });

                        });

                        GM.event.addListener(marker, 'mouseout', function () {
                            var marker = this;
                            boxInfoAir.setVisible(false);
                            marker.setIcon(iconAirDefault);
                        });
                    }


                    var showOneHotel = function (data_hotel) {
                        // проходм по всем маркерам
                        var mark = markers.filter(function (marker) {

                            // сравниваем и находим нужный
                            if ((marker.$inna__hotel && marker.$inna__hotel.Latitude) &&
                                (marker.$inna__hotel.Latitude == data_hotel.Latitude)) {


                                scope.$apply(function ($scope) {
                                    $scope.currentHotel = marker.$inna__hotel;
                                });

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

                                // меняем иконку
                                marker.setIcon(iconClick);

                                // показываем
                                boxInfo.setVisible(true);


                                var bounds = new GM.LatLngBounds();
                                var position = new GM.LatLng(data_hotel.Latitude, data_hotel.Longitude);

                                bounds.extend(position);

                                map.fitBounds(bounds);
                                map.setZoom(15);

                                map.panTo(marker.getPosition());
                                // инициализация карусели
                                initCarousel();
                                return marker;
                            }
                        });
                    }


                    /**
                     * Событие обновления фильтров
                     */
                    scope.$on('change:hotels:filters', function (evt, data) {
                        updateMap({
                            hotels: data,
                            airports: scope.airports
                        })
                    });

                    /**
                     * Переход с карточки отеля
                     */
                    scope.$on('map:show-one-hotel', function (evt, data) {
                        showOneHotel(data.toJSON());
                    });


                    function updateMap(data) {
                        var rawHotels = null;
                        var hotels = (data.hotels) ? data.hotels : [];
                        var airports = (data.airports) ? data.airports : [];

                        rawHotels = (hotels.toJSON) ? hotels.toJSON() : [];
                        removeMarkers();

                        rawHotels.forEach(function (hotel) {

                            //console.log(hotel.hidden, 'hotel.hidden');
                            if (hotel.hidden) return;

                            if (!hotel.Latitude || !hotel.Longitude) return;

                            var markerData = addMarker(angular.extend(hotel, { type: 'hotel' }));
                            var marker = markerData.marker;
                            marker.$inna__hotel = hotel;
                            marker._hotelId_ = hotel.HotelId;

                            markerEvents(markerData);
                            _bounds.extend(markerData.pos);
                            markers.push(marker);
                        });

                        airports.forEach(function (airport) {
                            airport.data = angular.copy(airport);
                            angular.extend(airport, { type: 'airport' });

                            if (!airport.Latitude || !airport.Longitude) return;

                            var markerData = addMarker(airport);
                            var marker = markerData.marker;
                            marker.$airport = airport;
                            markerAirEvents(markerData);
                            markers.push(marker);
                        });

                        addCluster();
                    }

                    scope.$watchCollection('[hotels, airports]', function (data) {
                        updateMap({
                            hotels: data[0],
                            airports: data[1]
                        })

                        map.fitBounds(_bounds);
                    });
                }
            }
        }]);
