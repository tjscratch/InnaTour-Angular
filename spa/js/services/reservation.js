/**
 * ReservationModel
 *
 Passengers[0][Sex]=1
 Passengers[0][I]=PAVEL
 Passengers[0][F]=PAVEL
 Passengers[0][Birthday]=10.10.1980
 Passengers[0][DocumentId]=1
 Passengers[0][Number]=123431341
 Passengers[0][ExpirationDate]=10.10.2020
 Passengers[0][Citizen]=189
 Passengers[0][Index]=0
 Passengers[1][Sex]=1||2
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
innaAppServices.service('ReservationService', function ($http, appApi) {
    return {
        /**
         * ReservationModel
         * Объект для отправки на сервер
         * @type {{Email: null, Phone: null, IsSubscribe: boolean, IsNeededVisa: boolean, IsNeededTransfer: boolean, IsNeededMedicalInsurance: boolean, PartnerMarker: null, partnerOperatorId: null, SearchParams: {HotelId: null, HotelProviderId: null, RoomId: null, CustomerWishlist: null, Filter: {ProviderId: null, ArrivalId: null, StartVoyageDate: null, Adult: null}}, Passengers: Array}}
         */
        ReservationModel: function () {
            return {
                Email: null,
                Phone: null,
                Agree: null,
                IsSubscribe: false,
                IsNeededVisa: false,
                IsNeededTransfer: false,
                IsNeededMedicalInsurance: false,
                PartnerMarker: null,
                partnerOperatorId: null,
                SearchParams: {
                    Adult: null,
                    ArrivalId: null,
                    NightCount: null,
                    StartVoyageDate: null,
                    hotelId: null,
                    providerId: null,
                    RoomId: null,
                    CustomerWishlist: null,
                },
                Passengers: []
            };
        },
        /**
         * Passenger
         * Объект описывающий пассажира
         * втыкается в ReservationModel
         * @type {{Index: null, Sex: null, I: null, F: null, Birthday: null, DocumentId: null, Number: null, ExpirationDate: null, Citizen: null}}
         */
        Passenger: function () {
            return {
                Index: null,
                Sex: 1,
                I: null,
                F: null,
                Birthday: null,
                DocumentId: 1,
                Number: null,
                ExpirationDate: null,
                Citizen: 189
            };
        },
        /**
         * данные для быстрого заполнения полей
         * включается добавлением в url параметра ?test=1
         * @returns {{Index: null, Sex: number, I: string, F: string, Birthday: string, DocumentId: number, Number: number, ExpirationDate: string, Citizen: number}}
         * @constructor
         */
        PassengerFake: function () {
            return {
                Index: null,
                Sex: 1,
                I: 'ALEX',
                F: 'GABRIELAN',
                Birthday: '23.11.1984',
                DocumentId: 2,
                Number: 664667234,
                ExpirationDate: '10.10.2022',
                Citizen: 189
            };
        },
        PassengerFake1: function () {
            return {
                Index: null,
                Sex: 2,
                I: 'MARI',
                F: 'GABRIELAN',
                Birthday: '05.04.1981',
                DocumentId: 2,
                Number: 664667276,
                ExpirationDate: '10.10.2020',
                Citizen: 189
            };
        },
        getReservationModel: function (PassengerCount, testMode) {
            var GenerateReservationModel = this.ReservationModel();
            if (testMode) {
                for (var i = 0; i < PassengerCount; i++) {
                    var NewPassenger;
                    if (i == 0) {
                        NewPassenger = this.PassengerFake();
                    } else {
                        NewPassenger = this.PassengerFake1();
                    }
                    NewPassenger["Index"] = i;
                    GenerateReservationModel.Email = "pasha_hotels@inna.ru";
                    GenerateReservationModel.Phone = "+79069593106";
                    GenerateReservationModel.Passengers.push(NewPassenger);
                }
            } else {
                for (var i = 0; i < PassengerCount; i++) {
                    var NewPassenger = this.Passenger();
                    NewPassenger["Index"] = i;
                    GenerateReservationModel.Passengers.push(NewPassenger);
                }
            }
            return GenerateReservationModel
        },
        reservation: function (params) {
            return $http({
                url: appApi.HOTELS_RESERVATION,
                method: 'POST',
                data: params
            });
        },
        getCountries: function () {
            return $http({
                url: appApi.GET_COUNTRIES,
                method: 'GET'
            });
        },
        getDocumentTypes: function () {
            return [
                { Id: 0, Name: 'Паспорт РФ' },
                { Id: 1, Name: 'Загранпаспорт' },
                { Id: 2, Name: 'Св-во о рождении' },
                { Id: 3, Name: 'Иностранный документ' }
            ];
        }
    }
});
