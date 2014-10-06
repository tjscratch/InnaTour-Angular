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

    self.toJson = function () {
        return angular.toJson(self);
    };
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
    self.checked = false;//выбрано по-умлочанию
};

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


/*
 * Other way
 * */
_.provide('inna.Models.Avia');

inna.Models.Avia.TicketCollection = inna.Models._CollectionFactory();

inna.Models.Avia.TicketCollection.prototype.search = function (id1, id2) {
    return this.advancedSearch(function (ticket) {
        return ((ticket.data.VariantId1 == id1) && (ticket.data.VariantId2 == id2));
    });
};

inna.Models.Avia.TicketCollection.prototype.searchId = function(id){
    var L = this.list.length;
    var ticket = null;
    for (var i = 0; i < L ;i++) {
        if(this.list[i].data.VariantId1 == id){
            ticket = this.list[i];
        }
    }
    return ticket;
}

inna.Models.Avia.TicketCollection.prototype.advancedSearch = function (criteria) {
    var DEFAULT = null;
    var ticket = DEFAULT;

    for (var i = 0; ticket = this.list[i++];) {
        if (criteria(ticket)) break;
    }

    return ticket || DEFAULT;
}

inna.Models.Avia.TicketCollection.prototype.getMinPrice = function (bundle) {
    var min = Number.MAX_VALUE;

    this.each(function(ticket){
        var price;

        if(bundle) {
            var vBundle = new inna.Models.Dynamic.Combination();
            vBundle.hotel = bundle.hotel;
            vBundle.ticket = ticket;

            price = vBundle.getFullPackagePrice();
        } else {
            price = ticket.data.Price;
        }

        if (price < min) min = price;
    });

    return min;
};

inna.Models.Avia.TicketCollection.prototype.getMaxPrice = function () {
    var max = 0;

    for (var i = 0, ticket = null; ticket = this.list[i++];) {
        if (ticket.data.Price > max) max = ticket.data.Price;
    }

    return max;
};

inna.Models.Avia.TicketCollection.prototype.getVisibilityInfo = function () {
    var o = {}
    o.total = this.list.length
    o.visible = o.total;

    this.each(function (ticket) {
        if (ticket.hidden) o.visible--;
    });

    return o;
};

inna.Models.Avia.TicketCollection.prototype.sort = function (sortingFn) {
    this.list.sort(sortingFn);
}

inna.Models.Avia.TicketCollection.prototype.hideBundled = function(bundle){
    var v1 = bundle.ticket.data.VariantId1;
    var v2 = bundle.ticket.data.VariantId2;

    var ticket = this.search(v1, v2);

    ticket && (ticket.hidden = true);
}

inna.Models.Avia.Ticket = function () {
    this.data = null;
    this.raw = null;
    this.hidden = false;
};

inna.Models.Avia.Ticket.prototype.setData = function (data) {
    this.raw = angular.copy(data);
    this.data = angular.copy(data);

    if (this.data) {
        for (var i = 0, dir = ''; dir = ['To', 'Back'][i++];) {
            var etaps = this.data['Etaps' + dir];

            for (var j = 0, len = etaps.length; j < len; j++) {
                etaps[j] = new inna.Models.Avia.Ticket.Etap(etaps[j]);
            }
        }
        this.data.ArrivalDate = dateHelper.apiDateToJsDate(this.data.ArrivalDate);
        this.data.BackArrivalDate = dateHelper.apiDateToJsDate(this.data.BackArrivalDate);
        this.data.DepartureDate = dateHelper.apiDateToJsDate(this.data.DepartureDate);
        this.data.BackDepartureDate = dateHelper.apiDateToJsDate(this.data.BackDepartureDate);
    }
};

inna.Models.Avia.Ticket.__getDuration = function (raw, hoursIndicator, minutesIndicator) {
    if(!raw) return '';

    var hours = Math.floor(raw / 60);
    var mins = raw % 60;

    return hours + ' ' + hoursIndicator + (
        mins ? (' ' + mins + ' ' + minutesIndicator) : ''
        );
};

inna.Models.Avia.Ticket.prototype.getDuration = function (dir) {
    return inna.Models.Avia.Ticket.__getDuration(this.data['Time' + dir], 'ч.', 'мин.');
};

inna.Models.Avia.Ticket.prototype.getDate = function (dir, type) {
    dir = {'To': '', 'Back': 'Back'}[dir]
    type = [dir, type, 'Date'].join('');

    return this.data[type];
}

inna.Models.Avia.Ticket.prototype.getEtaps = function (dir) {
    return this.data['Etaps' + dir];
};

inna.Models.Avia.Ticket.prototype.everyEtap = function (cb) {
    for (var i = 0, dir = '', etaps = null; (dir = ['To', 'Back'][i++]) && (etaps = this.getEtaps(dir));) {
        for (var j = 0, etap = null; etap = etaps[j++];) {
            cb.call(this, etap);
        }
    }
}


inna.Models.Avia.Ticket.prototype.getNextEtap = function (dir, current) {
    var etaps = this.getEtaps(dir);
    var i = etaps.indexOf(current);

    return etaps[++i];
};

inna.Models.Avia.Ticket.prototype.collectAirlines = function () {
    var airlines = [];
    var transportersList = [];

    this.everyEtap(function(etap){
        airlines.push([etap.data.TransporterCode, etap.data.TransporterName]);
        transportersList.push({
            code : etap.data.TransporterCode,
            name : etap.data.TransporterName
        });
    });

    var collected = _.object(airlines);

    var transportersListUniq = _.uniq(angular.copy(transportersList), false, function (tr) {
        return tr.code
    });

    return {
        airlines : transportersListUniq,
        etap: collected,
        size: Object.keys(collected).length
    }
};

inna.Models.Avia.Ticket.prototype.getBackOutCode = function(){
    var etapsBack = this.getEtaps('Back');
    var lastEtap = etapsBack[0];

    return lastEtap.data.OutCode;
}

inna.Models.Avia.Ticket.prototype.getBackInCode = function(){
    var etapsBack = this.getEtaps('Back');
    var lastEtap = etapsBack[etapsBack.length - 1];

    return lastEtap.data.InCode;
};

inna.Models.Avia.Ticket.Etap = function (data) {
    this.data = data;
};

inna.Models.Avia.Ticket.Etap.prototype.getDateTime = function (dir) {
    return dateHelper.apiDateToJsDate(this.data[dir + 'Time']);
};

inna.Models.Avia.Ticket.Etap.prototype.getDuration = function () {
    return inna.Models.Avia.Ticket.__getDuration(this.data.WayTime, 'ч.', 'м');
};

inna.Models.Avia.Ticket.Etap.prototype.getLegDuration = function () {
    var a = dateHelper.apiDateToJsDate(this.data.InTime);
    var b = dateHelper.apiDateToJsDate(this.data.NextTime);
    var diffMSec = b - a;
    var diffMin = Math.floor(diffMSec / 60000);

    return inna.Models.Avia.Ticket.__getDuration(diffMin, 'ч.', 'мин.');
};

_.provide('inna.Models.Avia.Filters');

inna.Models.Avia.Filters.FilterSet = function () {
    this.filters = [];
};

inna.Models.Avia.Filters.FilterSet.prototype.add = function (filter) {
    this.filters.push(filter);

    return filter;
};

inna.Models.Avia.Filters.FilterSet.prototype.each = function (fn) {
    for (var i = 0, filter = null; filter = this.filters[i++];) {
        fn(filter);
    }
}

inna.Models.Avia.Filters.Filter = function (name) {
    this.name = name;
    this.defaultValue = null;
    this.options = null;
    this.filterFn = angular.noop;
};

inna.Models.Avia.Filters.Filter.prototype.reset = function () {
    this.options.each(function (option) {
        option.selected = false;
    });
};

inna.Models.Avia.Filters._OptionFactory = function (init) {
    var Option = function (title) {
        this.title = title;
        this.shown = false;
        this.selected = false;

        if (init) init.apply(this, arguments);
    };

    return Option;
};

inna.Models.Avia.Filters._OptionsFactory = function () {
    var Options = function (options) {
        this.options = options || [];
    };

    Options.prototype.push = function (option) {
        this.options.push(option);
    }

    Options.prototype.each = function (fn) {
        for (var i = 0, option = null; option = this.options[i++];) {
            fn(option);
        }
    };

    Options.prototype.getSelected = function () {
        var newSet = new Options();

        this.each(function (option) {
            if (option.selected) newSet.push(option);
        });

        return newSet;
    }

    Options.prototype.hasSelected = function () {
        var hasSelected = false;

        this.each(function (option) {
            hasSelected = hasSelected || option.selected;
        });

        return hasSelected;
    }

    Options.prototype.reset = function () {
        this.each(function (option, undefined) {
            if (option.reset) {
                option.reset();
            } else {
                option.selected = false;
            }
        });
    }

    Options.prototype.hasManyShownOptions = function () {
        var has = 0;

        this.each(function (option) {
            option.shown && has++;
        });

        return has > 1;
    }

    return Options;
}