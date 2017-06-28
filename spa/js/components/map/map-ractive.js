/**
 * На маркерах карты создаем  infoBox двух разных типов
 * Это preview infoBox и полноценный infoBox с информацией и фотографиями
 * При этом не создаются новые экземпляры классов InfoBox,
 * прячем и показываем снова один созданный тип  InfoBox
 *
 */

angular.module('innaApp.directives')
    .directive('DynamicMap', [
        'EventManager',
        '$templateCache',
        'innaAppApiEvents',

        // components
        'MapInfoBox',
        'MapInfoBoxAir',
        'MapInfoBoxHover',
        function (EventManager, $templateCache, Events, MapInfoBox, MapInfoBoxAir, MapInfoBoxHover) {


            var DynamicMap = Ractive.extend({
                template: $templateCache.get('components/map/templ/index.hbs.html'),
                data: {
                    asMap: true,
                    isArray: angular.isArray,
                    currentHotel: null,
                    currentHotelPreview: null,
                    airMarker: null,
                    mapSizeShort: true,
                    markers : []
                },
                components: {
                    MapInfoBox : MapInfoBox,
                    MapInfoBoxAir : MapInfoBox,
                    MapInfoBoxHover : MapInfoBoxHover
                },
                onrender: function (options) {
                    var that = this;


                    // console.log('map init');

                    this.on({
                        teardown: function (evt) {
                            EventManager.fire(Events.DYNAMIC_SERP_MAP_DESTROY);
                            EventManager.off(Events.DYNAMIC_SERP_OPEN_BUNDLE);
                            EventManager.off(Events.DYNAMIC_SERP_CLOSE_BUNDLE);

                            EventManager.off(Events.LIST_PANEL_FILTES_HOTELS_DONE, updateMap);
                            EventManager.off(Events.LIST_PANEL_FILTES_RESET_DONE, updateMap);
                            EventManager.off(Events.DYNAMIC_SERP_TOGGLE_MAP, updateMap);
                            EventManager.off(Events.DYNAMIC_SERP_GO_TO_MAP, showOneHotel);


                            this._GM.event.addListener(map);
                            this._GM = null;
                            this._bounds = null;
                            this.map = null;
                            this.dataInfoBox = null;
                        },
                        setHotel: function (currentHotel) {
                            EventManager.fire(Events.DYNAMIC_SERP_CHOOSE_HOTEL, this.getCurrentHotel());
                        },
                        hotelDetails: function (currentHotel) {
                            EventManager.fire(Events.DYNAMIC_SERP_MORE_DETAIL_HOTEL, this.getCurrentHotel());
                        },

                        shortMap: function () {
                            this.set('mapSizeShort', true);
                        }
                    })


                    /** Событие обновления фильтров */
                    EventManager.on(Events.LIST_PANEL_FILTES_HOTELS_DONE, updateMap);
                    EventManager.on(Events.LIST_PANEL_FILTES_RESET_DONE, updateMap);


                    EventManager.on(Events.DYNAMIC_SERP_OPEN_BUNDLE, function () {
                        that.set('mapSizeShort', false);
                    });

                    EventManager.on(Events.DYNAMIC_SERP_CLOSE_BUNDLE, function () {
                        that.set('mapSizeShort', true)
                    });

                    /**
                     * Переход со списка отелей на карту
                     * Получаем весь набор отелей или отфильтрованный набор
                     *
                     *
                     * Также работает переход с карточки отеля
                     */
                    EventManager.observe('DYNAMIC_SERP_TOGGLE_MAP', function (value) {
                        // console.log(value, 'DYNAMIC_SERP_TOGGLE_MAP');

                        EventManager.fire(Events.DYNAMIC_SERP_CLOSE_BUNDLE);
                        EventManager.fire(Events.DYNAMIC_SERP_MAP_LOAD);
                        that.fire('shortMap');


                        if (value && value.list && value.list.length) {
                            that.updateMap({hotels: value.list});

                            // если перешли на карту с карточки отеля
                            if (value && value.single && value.single.data) {
                                setTimeout(function () {
                                    that.showOneHotel((value.single.toJSON) ? value.single.toJSON() : value.single);
                                }, 1000);
                            }
                        }

                        //map.fitBounds(_bounds);
                    });

                },


                getCurrentHotel: function () {

                },

                setCurrentHotel: function () {

                },

                defineMap: function () {
                    var that = this;
                    this._GM = google.maps;
                    this.map = null;
                    this._bounds = new this._GM.LatLngBounds();
                    var mapContainer = this.el.find('#big-map-canvas');

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

                    this.map = new this._GM.Map(mapContainer, {
                        center: new this._GM.LatLng(0, 0),
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


                    this._GM.event.addListener(map, 'click', function (evt) {
                        this.activeMarkerReset();
                    });
                },

                defineMapIcons: function () {
                    this.iconAirDefault = 'spa/img/map/marker-black-air.png?' + Math.random().toString(16);
                    this.iconAirClick = 'spa/img/map/marker-green-air.png?' + Math.random().toString(16);
                    this.iconDefault = 'spa/img/map/pin-grey.png?' + Math.random().toString(16);
                    this.iconHover = 'spa/img/map/pin-black.png?' + Math.random().toString(16);
                    this.iconCluster = 'spa/img/map/pin-circle.png?' + Math.random().toString(16);
                    this.iconHoverCluster = 'spa/img/map/pin-circle-black.png?' + Math.random().toString(16);
                    this.iconClick = 'spa/img/map/pin-green.png?' + Math.random().toString(16);
                },


                setActiveMarker: function (data_marker) {

                },

                activeMarkerReset: function () {

                },


                /**
                 * Анимация
                 * @param marker
                 */
                toggleBounce: function (marker) {
                    if (marker.getAnimation() != null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(this._GM.Animation.BOUNCE);
                    }
                },

                reDraw: function (box) {
                    var oldDraw = box.draw;
                    box.draw = function () {
                        oldDraw.apply(this);
                        jQuery(box.div_).hide();
                        jQuery(box.div_).fadeIn(200);
                    }
                },

                /**
                 *
                 * @param data
                 */
                addInfoBox: function (data) {

                    this.setActiveMarker(data);
                },

                /**
                 * Добавить маркер
                 * @param hotel
                 * @returns {{marker: GM.Marker, pos: GM.LatLng}}
                 */
                addMarker: function (data_for_marker) {
                    var that = this;
                    var data = data_for_marker;
                    var position = new this._GM.LatLng(data.Latitude, data.Longitude);

                    var image = new this._GM.MarkerImage(
                        (data.type == 'hotel') ? that.iconDefault : that.iconAirDefault,
                        new google.maps.Size(55, 46),
                        new google.maps.Point(0, 0)
                    );

                    var shape = {
                        coord: [1, 1, 1, 43, 32, 43, 32 , 1],
                        type: 'poly'
                    };

                    var marker = new this._GM.Marker({
                        position: position,
                        animation: this._GM.Animation.DROP,
                        icon: image,
                        shape: shape,
                        title: (data.HotelName) ? data.HotelName : ''
                    });
                    return  {
                        marker: marker,
                        pos: position
                    }
                },


                /**
                 * Удалить маркер
                 * removeMarkers
                 */
                removeMarkers: function () {
                    var that = this;
                    this.get('markers').forEach(function (marker) {
                        marker.setMap(null);
                    });
                    this.set('markers', []);

                    if (this._markerCluster)
                        this._markerCluster.clearMarkers();
                },

                /**
                 * Добавить маркер группировки
                 * addCluster
                 */
                addCluster: function () {
                    var that = this;

                    this._markerCluster = new MarkerClusterer(map, markers, {
                        gridSize: 20,
                        styles: [
                            {
                                url: that.iconCluster,
                                height: 50,
                                width: 50,
                                anchor: [16, 0],
                                textColor: '#ffffff',
                                textSize: 12,
                                fontWeight: 'normal'
                            }
                        ]
                    });

                    this.zoomMapDefault = map.getZoom();

                    /*this._GM.event.addListener(_markerCluster, 'mouseover', function (c) {
                     })

                     this._GM.event.addListener(_markerCluster, 'mouseover', function (c) {

                     })*/
                },

                /**
                 * События маркера на карте
                 * @param data
                 */
                markerEvents: function (data) {
                    var that = this;
                    var marker = data.marker;
                    var pos = data.pos;

                    this._GM.event.addListener(marker, 'click', function () {
                        var marker = this;

                        var pos = this.getPosition();

                        /*scope.$apply(function ($scope) {
                            $scope.currentHotel = angular.copy(marker.$inna__hotel);
                        });*/

                        // ценрируем карту
                        that.map.panTo(pos);

                        // если уже есть активный маркер, то сбрасываем его
                        that.activeMarkerReset();
                        // меняем цвет маркера
                        marker.setIcon(that.iconClick);

                        // Показываем большой infoBox
                        that.addInfoBox({
                            elem: that.boxPhoto,
                            pos: pos,
                            marker: {
                                activeMarker: marker,
                                infoBoxVisible: true,
                                hover: false
                            }
                        });
                    });

                    this._GM.event.addListener(marker, 'mouseover', function () {
                        var marker = this;

                        if (!marker.infoBoxVisible) {
                            /*scope.$apply(function ($scope) {
                                $scope.currentHotelPreview = angular.copy(marker.$inna__hotel);
                            });*/

                            marker.setIcon(iconHover);
                            that.addInfoBox({
                                elem: that.boxPreview,
                                pos: pos,
                                marker: {
                                    activeMarker: marker,
                                    infoBoxPreview: true,
                                    hover: true
                                }
                            });
                        }
                    });

                    this._GM.event.addListener(marker, 'mouseout', function () {
                        var marker = this;
                        if (!marker.infoBoxVisible) {
                            that.boxInfoHover.setVisible(false);
                            marker.setIcon(iconDefault);
                        }
                    });
                },
                /**
                 * События маркера для аэропортов
                 * @param data
                 */
                markerAirEvents: function (data) {
                    var that = this;
                    var marker = data.marker;
                    var pos = data.pos;

                    this._GM.event.addListener(marker, 'mouseover', function () {
                        var marker = this;

                        /*scope.$apply(function ($scope) {
                            $scope.airport = marker.$airport;
                        });*/

                        marker.setIcon(that.iconAirClick);

                        that.addInfoBox({
                            elem: that.boxAir,
                            pos: pos,
                            marker: {
                                activeMarker: marker,
                                air: true
                            }
                        });

                    });

                    this._GM.event.addListener(marker, 'mouseout', function () {
                        var marker = this;
                        that.boxInfoAir.setVisible(false);
                        marker.setIcon(that.iconAirDefault);
                    });
                },


                showOneHotel: function (data_hotel) {
                    var that = this;

                    // console.log('showOneHotel');

                    // проходм по всем маркерам
                    var mark = this.get('markers').filter(function (marker) {

                        // сравниваем и находим нужный
                        if ((marker.$inna__hotel && marker.$inna__hotel.Latitude) &&
                            (marker.$inna__hotel.Latitude == data_hotel.Latitude)) {


                            /*scope.$apply(function ($scope) {
                                $scope.currentHotel = marker.$inna__hotel;
                            });*/

                            // инициализируем infoBox
                            that.addInfoBox({
                                elem: that.boxPhoto,
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
                            that.boxInfo.setVisible(true);


                            var bounds = new that._GM.LatLngBounds();
                            var position = new that._GM.LatLng(data_hotel.Latitude, data_hotel.Longitude);

                            bounds.extend(position);

                            that.map.fitBounds(bounds);
                            that.map.setZoom(15);

                            that.map.panTo(marker.getPosition());
                            // инициализация карусели
                            that.initCarousel();
                            return marker;
                        }
                    });
                },


                updateMap: function (data) {
                    var that = this;

                    if (this.boxInfo) {
                        this.boxInfo.setVisible(false);
                    }

                    var tempArrHotels = null;
                    var rawHotels = null;
                    var hotels = (data.hotels) ? data.hotels : data;
                    var airports = (data.airports) ? data.airports : [];

                    tempArrHotels = (hotels.toJSON) ? hotels.toJSON() : hotels;
                    rawHotels = [].concat(angular.copy(tempArrHotels));
                    this.removeMarkers();

                    rawHotels.forEach(function (hotel) {

                        var hotelRaw = angular.copy(hotel);

                        if (!hotelRaw.Latitude || !hotelRaw.Longitude) return;

                        var markerData = addMarker(angular.extend(hotelRaw, { type: 'hotel' }));
                        var marker = markerData.marker;

                        marker.$inna__hotel = hotelRaw;

                        marker._hotelId_ = hotelRaw.HotelId;

                        that.markerEvents(markerData);
                        that._bounds.extend(markerData.pos);


                        // собираем маркеры
                        that.push('markers', marker);
                    });

                    airports.forEach(function (airport) {
                        airport.data = angular.copy(airport);
                        angular.extend(airport, { type: 'airport' });

                        if (!airport.Latitude || !airport.Longitude) return;

                        var markerData = addMarker(airport);
                        var marker = markerData.marker;
                        marker.$airport = airport;
                        that.markerAirEvents(markerData);

                        that.push('markers', marker);
                    });

                    this.addCluster();
                },

                mapLoad: function () {
                    this.toggle('asMap');
                }
            });

            return DynamicMap;
        }]);
