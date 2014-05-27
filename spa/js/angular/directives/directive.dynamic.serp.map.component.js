/**
 * На маркерах карты создаем  infoBox двух разных типов
 * Это preview infoBox и полноценный infoBox с информацией и фотографиями
 * При этом не создаются новые экземпляры классов InfoBox,
 * прячем и показываем снова один созданный тип  InfoBox
 *
 */

angular.module('innaApp.directives')
    .directive('infoBoxCarousel', [function () {

        return {
            controller: ['$scope', function ($scope) {

            }],
            link: function ($scope, elem, attrs) {


                var that = this;
                $scope._options = {};

                /**
                 * Настройки для карусели
                 * @type {*|Query|Cursor}
                 * @private
                 */

                var $thisEl = elem[0];
                var carouselHolder = $thisEl.querySelector('.b-carousel__holder');
                var _slider = $thisEl.querySelector('.b-carousel__slider');
                var _sliderItem = _slider.querySelectorAll('.b-carousel__slider_item');
                var _sliderItemTotal = $scope.$parent.currentHotel.data.Photos.length;
                var _sliderItemWidth = 360;
                var _sliderIndex = 0;
                var _sliderSpeed = 500;

                // ширина блока с контентом карусели
                _slider.style.width = ((_sliderItemTotal * _sliderItemWidth) + 10) + 'px';
                _slider.style.height = 240 + 'px';

                _sliderItem.forEach(function (slider) {
                    console.log(slider);
                    slider.style.width = _sliderItemWidth + 'px';
                });

                carouselHolder.style.width = _sliderItemWidth;

                elem.on('click', '.b-carousel__next', slideNext);
                elem.on('click', '.b-carousel__prev', slidePrev);

                /**
                 * анимация карусели
                 * @param index
                 */
                var carouselSlide = function (index) {
                    /*angular.element(_slider).stop().animate({
                     left: '-' + (_sliderIndex * _sliderItemWidth) + 'px'
                     }, _sliderSpeed);*/
                    angular.element(_slider).css({
                        "-webkit-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                        "-moz-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                        "-ms-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                        "transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)"
                    });
                }


                function slideNext(evt) {
                    evt.preventDefault();
                    var $this = $(evt.currentTarget);

                    _sliderIndex += 1;
                    _sliderIndex = ( _sliderIndex > _sliderItemTotal - 1) ? 0 : _sliderIndex
                    carouselSlide(_sliderIndex);
                }


                function slidePrev(evt) {
                    evt.preventDefault();
                    var $this = $(evt.currentTarget);

                    _sliderIndex -= 1;
                    _sliderIndex = ( _sliderIndex < 0) ? _sliderItemTotal - 1 : _sliderIndex
                    carouselSlide(_sliderIndex);
                }
            }
        }

    }])
    .directive('dynamicSerpMap', [function () {
        return {
            templateUrl: '/spa/templates/pages/dynamic/inc/serp.hotels.map.html',
            replace: true,
            scope: {
                hotels: '=dynamicSerpMapHotels',
                airports: '=dynamicSerpMapAirports'
            },
            controller: [
                '$scope',
                function ($scope) {
                    $scope.currentHotel = null;
                    $scope.currentHotelPreview = null;
                    $scope.airMarker = null;

                    // прячем footer
                    $scope.$emit('region-footer:hide');
                    $scope.$emit('toggle:visible:bundle');

                    console.log($scope);
                }
            ],
            link: function (scope, elem, attrs) {

                var mapContainer = elem[0].querySelector('#big-map-canvas');
                var markers = [];
                var _markerCluster = null;
                var iconAirDefault = 'spa/img/map/marker-black-air.png?' + Math.random().toString(16);
                var iconAirClick = 'spa/img/map/marker-green-air.png?' + Math.random().toString(16);
                var iconDefault = 'spa/img/map/pin-grey.png?' + Math.random().toString(16);
                var iconHover = 'spa/img/map/pin-black.png?' + Math.random().toString(16);
                var iconClick = 'spa/img/map/pin-green.png?' + Math.random().toString(16);
                var activeMarker = null;
                var activeMarkerHover = null;
                var GM = google.maps;
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
                    //var elementWidth = elem.find('.pin-balloon').width();

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
                            boxInfoHover.setVisible(true);
                            boxInfoHover.setPosition(data.pos);
                        }

                        // инфобокс для аэропорта
                    } else if (dataMarker.air) {
                        if (!boxInfoAir) {
                            boxInfoAir = new InfoBox(dataInfoBox);
                            boxInfoAir.open(map);
                        } else {
                            boxInfoAir.setVisible(true);
                            boxInfoAir.setPosition(data.pos);
                        }

                        // инфобокс на клик маркера отеля
                    } else {
                        boxInfoHover.setVisible(false);
                        if (!boxInfo) {
                            boxInfo = new InfoBox(dataInfoBox);
                            boxInfo.open(map);
                            reDraw(boxInfo);
                        } else {
                            boxInfo.setVisible(true);
                            boxInfo.setPosition(data.pos);
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
                    var position = new GM.LatLng(data.data.Latitude, data.data.Longitude);

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
                        title: (data.data.HotelName) ? data.data.HotelName : ''
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

                        scope.$apply(function ($scope) {
                            $scope.currentHotel = marker.$inna__hotel;
                        });


                        var pos = this.getPosition();
                        //var proj = this.getMap().getProjection();

                        // ценрируем карту
                        map.panTo(pos);

                        // если уже есть активный маркер, то сбрасываем его
                        activeMarkerReset();
                        // меняем цвет маркера
                        marker.setIcon(iconClick);

                        // Показываем большой infoBox
                        addInfoBox({
                            elem: elem[0].querySelector('.big-map__balloon'),
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

                        scope.$apply(function ($scope) {
                            $scope.currentHotelPreview = marker.$inna__hotel;
                        });

                        if (!marker.infoBoxVisible) {
                            marker.setIcon(iconHover);
                            addInfoBox({
                                elem: elem[0].querySelector('.big-map__balloon_preview'),
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
                            elem: elem[0].querySelector('.big-map__balloon_air'),
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


                scope.$on('change:hotels:filters', function(data){
                    console.log('broadcast');
                    updateMap({
                        hotels : data.targetScope.hotels
                    })
                });


                function updateMap(data){
                    var hotels = (data.hotels) ? data.hotels : [];
                    var airports = (data.airports) ? data.airports : [];

                    var bounds = new GM.LatLngBounds();
                    removeMarkers();

                    hotels.each(function (hotel) {

                        if (hotel.hidden) return;

                        if (!hotel.data.Latitude || !hotel.data.Longitude) return;

                        var markerData = addMarker(angular.extend(hotel, { type: 'hotel' }));
                        var marker = markerData.marker;
                        marker.$inna__hotel = hotel;

                        markerEvents(markerData);
                        bounds.extend(markerData.pos);
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

                    map.fitBounds(bounds);
                }

                /*scope.$watchCollection('[hotels, airports]', function (data) {
                    updateMap({
                        hotels : data[0],
                        airports : data[1]
                    })
                });*/
            }
        }
    }]);
