﻿
//параметры для серверной фильтрации
function criteria(data) {
    var self = this;
    data = data || {};

    self.FromCity = data.FromCity;
    self.FromCityId = data.FromCityId;
    self.FromCityUrl = data.FromCityUrl;
    self.ToCountry = data.ToCountry;
    self.ToCountryId = data.ToCountryId;
    self.ToCountryUrl = data.ToCountryUrl;
    self.ToRegion = data.ToRegion;
    self.ToRegionId = data.ToRegionId;
    self.ToRegionUrl = data.ToRegionUrl;

    self.StartMinString = data.StartMinString;
    self.StartDateVariance = data.StartDateVariance;
    self.AdultNumber = data.AdultNumber;
    self.ChildAgesString = data.ChildAgesString;
    self.DurationMin = data.DurationMin;

    //это уйдет в фильтры
    //self.HotelStarsMin = data.HotelStarsMin;
    //self.HotelStarsMax = data.HotelStarsMax;
    

    //self.errorMessage = ko.observable();

    self.toJson = function () { return angular.toJson(self); };
};

//параметры для клиентской фильтрации
function filter(data) {
    var self = this;

    //поля по-умолчанию
    self.hotelName = null;
    self.minPrice = null;
    self.maxPrice = null;
    self.mealsList = null;
    self.tourOperatorsList = null;
    self.starsList = null;
    self.hotelStarsMin = 1;
    self.hotelStarsMax = 5;
    self.services = { Internet: false, Pool: false, Aquapark: false, Fitness: false, ForChild: false };

    //присваиваем переданные значения
    angular.extend(self, data);
};

function hotel(data) {
    var self = this;
    data = data || {};

    self.HotelId = data.HotelId;
    self.HotelName = data.HotelName;
    self.MainPhoto = data.Hotel.MainPhoto;
    self.OriginalPhoto = data.Hotel.OriginalPhoto;
    self.Description = data.Hotel.description;
    self.Stars = data.Hotel.stars;
    self.Meals = data.Hotel.Meals;
    self.Properties = data.Hotel.Properties;

    self.Country = data.Hotel.Country;
    self.Region = data.Hotel.Region;
    self.City = data.Hotel.City;
    self.Services = data.Hotel.Services;

    self.Tours = data.Tours;

    self.TourCount = data.Tours.length;

    // min price by tours
    self.Price = 0;
    //все цены туров
    self.Prices = [];

    self.FilteredMinPrice = 0;

    //находим мин цену
    angular.forEach(data.Tours, function (item, key) {
        var value = parseFloat(item.Price != null ? item.Price.Value : null);

        if (!isNaN(value) && (value < self.Price || self.Price == 0)) {
            self.Price = value;
        }

        //ну и просто все цены
        if (!isNaN(value))
            self.Prices.push(value);
    });

    self.FilteredMinPrice = self.Price;
    //self.errorMessage = ko.observable();

    self.toJson = function () { return angular.toJSON(self); };
};
function hotelDetail(data) {
    var self = this;
    data = data || {};

    self.HotelId = data.HotelId;
    self.HotelName = data.HotelName;
    self.MainPhoto = data.Hotel.MainPhoto;
    self.OriginalPhoto = data.Hotel.OriginalPhoto;
    self.Description = data.Hotel.description;
    self.Stars = data.Hotel.stars;
    self.ServiceDescription = data.Hotel.service_description;
    self.RoomsDescription = data.Hotel.rooms_description;
    self.RoomService = data.Hotel.rooms_service;
    self.Meals = data.Hotel.Meals;
    self.Properties = data.Hotel.Properties;
    self.Tours = data.Tours;

    self.toJson = function () { return angular.toJSON(self); };
};


function tour(data) {
    var self = this;
    data = data || {};

    self.Id = data.Id,
    self.TourName = data.TourName,
    self.Price = data.Price != null ? data.Price.Value : null,
    self.Currency = data.Price != null ? data.Price.Currency : null,
    self.ProviderId = data.ProviderId,
    self.RoomName = data.RoomName,
    self.StartDate = data.StartDate,
    self.HotelName = data.HotelName,
    self.HotelStarsName = data.HotelStarsName,
    self.MomentConfirm = data.MomentConfirm,
    self.MealKey = data.MealKey,
    self.SearchId = data.SearchId,

    self.toJson = function () { return angular.toJSON(self); };
};

function tourDetail(data) {
    var self = this;
    data = data || {};


    self.SearchId = data.SearchId;
    self.HotelId = data.HotelId;
    self.TourId = data.TourId;
    self.Passengers = data.Passengers;

    self.I = data.I;
    self.F = data.F;
    self.Email = data.Email;
    self.Phone = data.Phone;
    

    var tour = data.TourDetailResult;
    self.Id = tour.Id,
    self.TourName = tour.TourName,
    self.Price = tour.Price != null ? tour.Price.Value : null,
    self.Currency = tour.Price != null ? tour.Price.Currency : null,
    self.ProviderId = tour.ProviderId,
    self.StartDate = tour.StartDate,
    self.MomentConfirm = tour.MomentConfirm,
    self.MealKey = tour.MealKey,
    
    self.Hotel = tour.Hotel,
    self.TourDetail = tour.TourDetail,

    self.HotelDetail = tour.HotelDetail,
    self.HotelDetail.MainPhoto = tour.HotelDetail.MainPhoto != null ? tour.HotelDetail.MainPhoto : null,
    self.HotelDetail.Country = tour.HotelDetail.Country,
    self.HotelDetail.Region = tour.HotelDetail.Region,
    self.HotelDetail.City = tour.HotelDetail.City,

    self.DirectFlight = tour.DirectFlight;
    self.DirectFlightVariants = tour.DirectFlightVariants;
    self.ReturnFlight = tour.ReturnFlight;
    self.ReturnFlightVariants = tour.ReturnFlightVariants;
    
    self.ExtraCharges = tour.ExtraCharges;
    self.TourInsurance = tour.TourInsurance;
    self.TourInsuranceVariants = tour.TourInsuranceVariants;
    self.Services = tour.Services;
    self.ToAirportTransfer = tour.ToAirportTransfer;
    self.ToAirportTransferVariants = tour.ToAirportTransferVariants;
    self.FromAirportTransfer = tour.FromAirportTransfer;
    self.FromAirportTransferVariants = tour.FromAirportTransferVariants;

    self.toJson = function () { return angular.toJSON(self); };
};


function paymentPage(data) {
    var self = this;
    data = data || {};


    self.OrderId = data.OrderId;
    
    self.SearchId = data.SearchId;
    self.HotelId = data.HotelId;
    self.TourId = data.TourId;
    

    self.toJson = function () { return angular.toJSON(self); };
};

function TripKlass(val, display) {
    this.value = val;
    this.display = display;
}

TripKlass.ECONOM = 2;

TripKlass.BUSINESS = 1;

TripKlass.options = [new TripKlass(TripKlass.ECONOM, 'Эконом'), new TripKlass(TripKlass.BUSINESS, 'Бизнес')];

TripKlass.prototype.getOptions = function(){
    return TripKlass.options;
}