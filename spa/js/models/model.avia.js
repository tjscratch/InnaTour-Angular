//параметры для серверной фильтрации
function aviaCriteria(data) {
    var self = this;
    data = data || {};

    self.From = data.From;
    self.FromId = data.FromId;
    self.FromUrl = data.FromUrl;
    self.To = data.To;
    self.ToId = data.ToId;
    self.ToUrl = data.ToUrl;
    self.BeginDate = data.BeginDate;
    self.EndDate = data.EndDate;
    self.AdultCount = data.AdultCount;
    self.ChildCount = data.ChildCount;
    self.InfantsCount = data.InfantsCount;
    self.CabinClass = data.CabinClass;
    self.IsToFlexible = data.IsToFlexible;
    self.IsBackFlexible = data.IsBackFlexible;
    self.PathType = data.PathType;

    //для покупки
    self.QueryId = data.QueryId;
    //для выбранного варианта
    self.VariantId1 = data.VariantId1;
    self.VariantId2 = data.VariantId2;
    self.OrderNum = data.OrderNum;

    self.toJson = function () {
        return angular.toJson(self);
    };
}

//параметры для клиентской фильтрации
function aviaFilter(data) {
    var self = {};

    //поля по-умолчанию
    self.minPrice = null;
    self.maxPrice = null;
    //количество пересадок
    self.ToTransferCount = null;
    self.BackTransferCount = null;
    //а/к
    //
    //время отправления ТУДА
    //self.DepartureDate = null;
    ////время прибытия ТУДА
    //self.ArrivalDate = null;
    ////время отправления ОБРАТНО
    //self.BackDepartureDate = null;
    ////время прибытия ОБРАТНО
    //self.BackArrivalDate = null;
    self.minDepartureDate = null;
    self.maxDepartureDate = null;
    self.minArrivalDate = null;
    self.maxArrivalDate = null;
    self.minBackDepartureDate = null;
    self.maxBackDepartureDate = null;
    self.minBackArrivalDate = null;
    self.maxBackArrivalDate = null;

    //дата отправления
    //дата прибытия
    //аэропорты

    //для фильтра {value:0, checked: true}
    self.ToTransferCountList = null;
    self.BackTransferCountList = null;
    //список: [без пересадок, 1 пересадка, 2 и более]
    self.ToTransferCountListAgg = null;
    self.BackTransferCountListAgg = null;
    //список авиакомпаний
    self.TransporterList = null;

    //присваиваем переданные значения
    angular.extend(self, data);

    //для фильтра
    self.minPriceInitial = self.minPrice;
    self.maxPriceInitial = self.maxPrice;
    //время отправления туда / обратно
    self.minDepartureDateInitial = self.minDepartureDate;
    self.maxDepartureDateInitial = self.maxDepartureDate;
    self.minArrivalDateInitial = self.minArrivalDate;
    self.maxArrivalDateInitial = self.maxArrivalDate;
    self.minBackDepartureDateInitial = self.minBackDepartureDate;
    self.maxBackDepartureDateInitial = self.maxBackDepartureDate;
    self.minBackArrivalDateInitial = self.minBackArrivalDate;
    self.maxBackArrivalDateInitial = self.maxBackArrivalDate;

    return self;
}

//ававкомпания для фильтра
function transporter(name, code, logo) {
    var self = this;
    self.TransporterName = name;
    self.TransporterCode = code;
    self.TransporterLogo = logo;
    self.checked = false;//выбрано по-умлочанию
}

//namespace
var avia = {
    useAviaServiceStub: false,
    dateFormat: 'dd MMMM yyyy, EEE',
    timeFormat: 'HH:mm',
    sortType: {
        byAgencyProfit: ['-PriceDetails.Profit'],
        byRecommend: ['-IsRecomendation', 'RecommendedFactor', 'sort.DepartureDate', 'sort.ArrivalDate'],
        byPrice: ['Price', 'sort.DepartureDate', 'sort.ArrivalDate'],
        byTripTime: ['TimeTo', 'Price', 'sort.DepartureDate', 'sort.ArrivalDate'],
        byDepartureTime: 'sort.DepartureDate',
        byBackDepartureTime: 'sort.BackDepartureDate',
        byArrivalTime: 'sort.ArrivalDate',
        byBackArrivalTime: 'sort.BackArrivalDate'
    },

    endOfClass: null
};
