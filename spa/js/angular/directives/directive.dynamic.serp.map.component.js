angular.module('innaApp.directives')
    .service('dynamicSerpMap_InfoBox', function () {
        //creating the class to exntend the google map OverlayView class
        function InfoBox(elem, position, title, icon_class) {
            this.lat = position.lat();
            this.lng = position.lng();
            this.title = title; //eg. A,B,C.D
            this.icon_class = icon_class || 'pin big-map__pin';
            this.pos = new google.maps.LatLng(this.lat, this.lng);
            this.elem = elem;
        }

        //make a copy of the OverlayView to extend it
        InfoBox.prototype = new google.maps.OverlayView();

        InfoBox.prototype.onRemove = function () {
            this.elem.parentNode.removeChild(this.elem);
            this.elem = null;
        }

        //prepare the overlay with DOM
        InfoBox.prototype.onAdd = function () {
            var div = this.elem;
            $(div).addClass(this.icon_class);
            this.getPanes()['floatPane'].appendChild(div);
            //panes.overlayLayer.appendChild(div);
        }

        //set position
        InfoBox.prototype.draw = function () {
            var overlayProjection = this.getProjection();
            var position = overlayProjection.fromLatLngToDivPixel(this.pos);
            var panes = this.getPanes()['floatPane'];
            panes.style.left = (position.x - 10) + 'px';
            panes.style.top = (position.y - 20) + 'px';
        }


        InfoBox.prototype.hide = function() {
            if (this.elem) {
                this.elem.style.visibility = "hidden";
            }
        }

        InfoBox.prototype.show = function() {
            if (this.elem) {
                this.elem.style.visibility = "visible";
            }
        }

        InfoBox.prototype.toggle = function() {
            if (this.elem) {
                if (this.elem.style.visibility == "hidden") {
                    this.show();
                } else {
                    this.hide();
                }
            }
        }

        return InfoBox;
    })
    .directive('dynamicSerpMap',['dynamicSerpMap_InfoBox', function (InfoBox) {
        return {
            templateUrl: '/spa/templates/pages/dynamic/inc/serp.hotels.map.html',
            replace: true,
            scope: {
                hotels: '=dynamicSerpMapHotels'
            },
            controller: [
                '$scope',
                function ($scope) {
                    $scope.currentHotel = null;

                    // прячем footer
                    $scope.$emit('region-footer:hide');
                }
            ],
            link: function (scope, elem, attrs) {

                var mapContainer = elem[0].querySelector('#big-map-canvas');
                var markers = [];
                var _markerCluster = null;
                var iconDefault = 'spa/img/map/pin-grey.png?' + Math.random().toString(16);
                var iconHover = 'spa/img/map/pin-black.png?' + Math.random().toString(16);
                var iconClick = 'spa/img/map/pin-green.png?' + Math.random().toString(16);
                var isInfoWindowOpen = false;
                var boxInfo = null;
                var GM = google.maps;
                var styleArray = [
                    {
                        featureType: "all",
                        stylers: [
                            { saturation: -60 }
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


                var getIsWindowOpen = function () {
                    return isInfoWindowOpen;
                }

                var setIsWindowOpen = function (data) {
                    isInfoWindowOpen = data;
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


                var addInfoBox = function (data) {
                    var boxInfo = new InfoBox(data.elem, data.pos);
                    boxInfo.setMap(map);

                    return boxInfo;
                }

                /**
                 * Добавить маркер
                 * @param hotel
                 * @returns {{marker: GM.Marker, pos: GM.LatLng}}
                 */
                var addMarker = function (hotel) {
                    var position = new GM.LatLng(hotel.data.Latitude, hotel.data.Longitude);

                    var marker = new GM.Marker({
                        position: position,
                        animation: GM.Animation.DROP,
                        icon: iconDefault,
                        title: hotel.data.HotelName
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
                                height: 35,
                                width: 35,
                                anchor: [16, 0],
                                textColor: '#ff00ff',
                                textSize: 10
                            }
                        ]
                    });
                }

                /**
                 * События карты
                 * @param marker
                 */
                var mapEvents = function (data) {
                    var marker = data.marker;
                    var pos = data.pos;


                    GM.event.addListener(marker, 'click', function () {
                        var marker = this;
                        console.log(marker);
                        scope.$apply(function ($scope) {
                            $scope.currentHotel = marker.$inna__hotel;
                        });

                        var pos = this.getPosition();
                        var proj = this.getMap().getProjection();

                        // ценрируем карту
                        map.setCenter(pos);
                        boxInfo = addInfoBox({
                            elem : elem[0].querySelector('.pin'),
                            pos : pos
                        })

                        marker.setIcon(iconClick);
                    });


                    GM.event.addListener(marker, 'mouseover', function () {
                        var marker = this;
                        if (!getIsWindowOpen()) marker.setIcon(iconHover);
                    });

                    GM.event.addListener(marker, 'mouseout', function () {
                        var marker = this;
                        if (!getIsWindowOpen()) marker.setIcon(iconDefault);
                    });
                }

                scope.$watchCollection('hotels', function (hotels) {
                    var bounds = new GM.LatLngBounds();

                    removeMarkers();

                    hotels.each(function (hotel) {

                        if (hotel.hidden) return;

                        if (!hotel.data.Latitude || !hotel.data.Longitude) return;

                        var markerData = addMarker(hotel);
                        var marker = markerData.marker;
                        marker.$inna__hotel = hotel;

                        mapEvents(markerData);
                        bounds.extend(markerData.pos);
                        markers.push(marker);
                    });

                    addCluster();

                    map.fitBounds(bounds);
                });
            }
        }
    }]);
