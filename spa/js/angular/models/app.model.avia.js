
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
    self.VariantId1 = data.VariantId1;
    self.VariantId2 = data.VariantId2;
    self.OrderNum = data.OrderNum;

    self.toJson = function () { return angular.toJson(self); };
};

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
};

//ававкомпания для фильтра
function transporter(name, code, logo) {
    var self = this;
    self.TransporterName = name;
    self.TransporterCode = code;
    self.TransporterLogo = logo;
    self.checked = true;//выбрано по-умлочанию
};

//namespace
var avia = {
    useAviaServiceStub: false,
    dateFormat: 'dd MMMM yyyy, EEE',
    timeFormat: 'HH:mm',
    sortType: {
        byRecommend: ['-IsRecomendation', 'sort.DepartureDate', 'sort.ArrivalDate'],
        byPrice: ['Price', 'sort.DepartureDate', 'sort.ArrivalDate'],
        byTripTime: ['TimeTo', 'Price', 'sort.DepartureDate', 'sort.ArrivalDate'],
        byDepartureTime: 'sort.DepartureDate',
        byBackDepartureTime: 'sort.BackDepartureDate',
        byArrivalTime: 'sort.ArrivalDate',
        byBackArrivalTime: 'sort.BackArrivalDate'
    },

    endOfClass: null
};



/*
* Other way
* */
_.provide('inna.Models.Avia');

inna.Models.Avia.TicketCollection = inna.Models._CollectionFactory();

inna.Models.Avia.TicketCollection.prototype.search = function(id1, id2){
    return this.advancedSearch(function(ticket){
        return ((ticket.data.VariantId1 == id1) && (ticket.data.VariantId2 == id2));
    });
};

inna.Models.Avia.TicketCollection.prototype.advancedSearch = function(criteria){
    var DEFAULT = null;
    var ticket = DEFAULT;

    for(var i = 0; ticket = this.list[i++];) {
        if(criteria(ticket)) break;
    }

    return ticket || DEFAULT;
}

inna.Models.Avia.TicketCollection.prototype.getMinPrice = function(){
    var min = Number.MAX_VALUE;

    for(var i = 0, ticket = null; ticket = this.list[i++];) {
        if(ticket.data.Price < min) min = ticket.data.Price;
    }

    return min;
};

inna.Models.Avia.TicketCollection.prototype.getMaxPrice = function(){
    var max = 0;

    for(var i = 0, ticket = null; ticket = this.list[i++];) {
        if(ticket.data.Price > max) max = ticket.data.Price;
    }

    return max;
};

inna.Models.Avia.TicketCollection.prototype.filter = function(filters) {
    this.each(function(ticket){ ticket.hidden = false; });

    for(var filterName in filters) if(filters.hasOwnProperty(filterName)) {
        var methodName = '_filterBy' + filterName;

        if(this[methodName]) {
            this[methodName](filters[filterName]);
        } else {
            console.warn('Can not apply filter %s', methodName);
        }
    }

    return this.list;
}

inna.Models.Avia.TicketCollection.prototype._filterByLegs = function(filter) {
    if(!filter.hasSelected()) return;

    this.each(function(ticket){
        var hide = true;
        var legsTo = ticket.getEtaps('To').length;
        var legsBack = ticket.getEtaps('Back').length;

        filter.each(function(option){
            if(!option.selected) return;

            hide = hide && !(option.comparator(legsTo) && option.comparator(legsBack));
        });

        ticket.hidden = hide;
    });
};

inna.Models.Avia.TicketCollection.prototype._filterByPrice = function(filter){
    this.each(function(ticket){
        if(ticket.data.Price > filter) {
            ticket.hidden = true;
        }
    });
};

inna.Models.Avia.TicketCollection.prototype._filterByTime = function(options){
    function checkOptionsInsideCategory(ticket, options) {
        if(!options.length) return true;

        var fits = false;

        for(var i = 0, option = null; option = options[i++];) {
            var propertyName = [option.direction.prefix, option.state.property].join('');
            var date = ticket.data[propertyName];
            fits = fits || dateHelper.isHoursBetween(date, option.start, option.end);

            if(fits) break;
        }

        return fits;
    }

    var optionsOfInterest = {};

    for(var i = 0, option = null; option = options.options[i++];) {
        if(!option.isChecked) continue;

        if(option.direction.states.getCurrent() != option.state) continue;

        (optionsOfInterest[option.direction.name] || (optionsOfInterest[option.direction.name] = [])).push(option);
    }

    this.each(function(ticket){
        var fits = true;

        for(var p in optionsOfInterest) if(optionsOfInterest.hasOwnProperty(p)) {
            fits = fits && checkOptionsInsideCategory(ticket, optionsOfInterest[p]);
        }

        if(!fits) {
            ticket.hidden = true;
        }
    });

    console.log('-----------------');
};

inna.Models.Avia.TicketCollection.prototype._filterByAirlines = function(options) {
    this.each(function(ticket){
        var show = false;

        var selected = [];
        for(var i = 0, option = null; option = options[i++];) {
            if(option.selected) selected.push(option);
        }

        if(!selected.length) return;

        for(var i = 0, option = null; option = selected[i++];) {
            if(!option.selected) continue;

            var airlines = ticket.collectAirlines();

            for(var code in airlines) if(airlines.hasOwnProperty(code)) {
                show = show || (airlines[code] == option.name);
            }
        }

        if(!show) {
            ticket.hidden = true;
        }
    });
}

inna.Models.Avia.Ticket = function (){
    this.data = null;
    this.hidden = false;
};

inna.Models.Avia.Ticket.prototype.setData = function(data) {
    this.data = angular.copy(data);

    if(this.data) {
        for(var i = 0, dir = ''; dir = ['To', 'Back'][i++];) {
            var etaps = this.data['Etaps' + dir];

            for(var j = 0, len = etaps.length; j < len; j++) {
                etaps[j] = new inna.Models.Avia.Ticket.Etap(etaps[j]);
            }
        }

        this.data.ArrivalDate = dateHelper.apiDateToJsDate(this.data.ArrivalDate);
        this.data.BackArrivalDate = dateHelper.apiDateToJsDate(this.data.BackArrivalDate);
        this.data.DepartureDate = dateHelper.apiDateToJsDate(this.data.DepartureDate);
        this.data.BackDepartureDate = dateHelper.apiDateToJsDate(this.data.BackDepartureDate);
    }
};

inna.Models.Avia.Ticket.__getDuration = function(raw, hoursIndicator, minutesIndicator){
    var hours = Math.floor(raw / 60);
    var mins = raw % 60;

    return hours + ' ' + hoursIndicator + (
        mins ? (' ' + mins + ' ' + minutesIndicator) : ''
        );
};

inna.Models.Avia.Ticket.prototype.getDuration = function(dir){
    return inna.Models.Avia.Ticket.__getDuration(this.data['Time' + dir], 'ч.', 'мин.');
};

inna.Models.Avia.Ticket.prototype.getEtaps = function(dir) {
    return this.data['Etaps' + dir];
};

inna.Models.Avia.Ticket.prototype.getNextEtap = function(dir, current){
    var etaps = this.getEtaps(dir);
    var i = etaps.indexOf(current);

    return etaps[++i];
};

inna.Models.Avia.Ticket.prototype.collectAirlines = function(){
    var airlines = [];

    for(var i = 0, dir = null; dir = ['To', 'Back'][i++];) {
        for(var j = 0, etap = null; etap = this.data['Etaps' + dir][j++];) {
            airlines.push([etap.data.TransporterCode, etap.data.TransporterName]);
        }
    }

    return _.object(airlines);
};

inna.Models.Avia.Ticket.Etap = function(data){
    this.data = data;
};

inna.Models.Avia.Ticket.Etap.prototype.getDateTime = function(dir) {
    return dateHelper.apiDateToJsDate(this.data[dir + 'Time']);
};

inna.Models.Avia.Ticket.Etap.prototype.getDuration = function(){
    return inna.Models.Avia.Ticket.__getDuration(this.data.WayTime, 'ч.', 'м');
};

inna.Models.Avia.Ticket.Etap.prototype.getLegDuration = function(){
    var a = dateHelper.apiDateToJsDate(this.data.InTime);
    var b = dateHelper.apiDateToJsDate(this.data.NextTime);
    var diffMSec = b - a;
    var diffMin = Math.floor(diffMSec / 60000);

    return inna.Models.Avia.Ticket.__getDuration(diffMin, 'ч.', 'мин.');
};