innaAppControllers.controller('ReservationsController', function ($scope, $routeParams) {

    /**
     * ReservationModel
     * Объект для отправки на сервер
     * @type {{Email: null, Phone: null, IsSubscribe: boolean, IsNeededVisa: boolean, IsNeededTransfer: boolean, IsNeededMedicalInsurance: boolean, PartnerMarker: null, partnerOperatorId: null, SearchParams: {HotelId: null, HotelProviderId: null, RoomId: null, CustomerWishlist: null, Filter: {ProviderId: null, ArrivalId: null, StartVoyageDate: null, Adult: null}}, Passengers: Array}}
     */
    $scope.ReservationModel = {
        Email: null,
        Phone: null,
        IsSubscribe: false,
        IsNeededVisa: false,
        IsNeededTransfer: false,
        IsNeededMedicalInsurance: false,
        PartnerMarker: null,
        partnerOperatorId: null,
        SearchParams: {
            HotelId: null,
            HotelProviderId: null,
            RoomId: null,
            CustomerWishlist: null,
            Filter: {
                ProviderId: null,
                ArrivalId: null,
                StartVoyageDate: null,
                Adult: null,
            }
        },
        Passengers: []
    };

    /**
     * Passenger
     * Объект описывающий пассажира
     * втыкается в ReservationModel
     * @type {{Index: null, Sex: null, I: null, F: null, Birthday: null, DocumentId: null, Number: null, ExpirationDate: null, Citizen: null}}
     */
    var Passenger = {
        Index: null,
        Sex: null,
        I: null,
        F: null,
        Birthday: null,
        DocumentId: null,
        Number: null,
        ExpirationDate: null,
        Citizen: null,
    };


    for (var i = 0; i < $routeParams.Adult; i++) {
        var Passenger_copy = angular.copy(Passenger);
        Passenger_copy["Index"] = i;
        $scope.ReservationModel.Passengers.push(Passenger_copy);
    }

});


/**
 Passengers[0][Sex]=1
 Passengers[0][I]=PAVEL
 Passengers[0][F]=PAVEL
 Passengers[0][Birthday]=10.10.1980
 Passengers[0][DocumentId]=1
 Passengers[0][Number]=123431341
 Passengers[0][ExpirationDate]=10.10.2020
 Passengers[0][Citizen]=189
 Passengers[0][Index]=0
 Passengers[1][Sex]=1
 Passengers[1][I]=ASFAF
 Passengers[1][F]=PVEL
 Passengers[1][Birthday]=10.10.1980
 Passengers[1][DocumentId]=1
 Passengers[1][Number]=134234523
 Passengers[1][ExpirationDate]=10.10.2021
 Passengers[1][Citizen]=189
 Passengers[1][Index]=1

 I
 F
 Email=maxstbn@gmail.com
 Phone=+79099593106
 IsSubscribe=false
 IsNeededVisa=false
 IsNeededTransfer=false
 IsNeededMedicalInsurance=false
 SearchParams[HotelId]=322642
 SearchParams[HotelProviderId]=4
 SearchParams[RoomId]=34fd5302-9211-6d56-10fd-dc4923c3aa5d
 SearchParams[Filter][ProviderId]=4
 SearchParams[Filter][ArrivalId]=3363
 SearchParams[Filter][StartVoyageDate]=2016-04-18
 SearchParams[Filter][Adult]=2
 SearchParams[CustomerWishlist]
 PartnerMarker
 partnerOperatorId
 */
