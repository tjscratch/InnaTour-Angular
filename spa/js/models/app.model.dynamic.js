_.provide('inna.Models.Hotels');

inna.Models.Hotels.HotelsCollection = inna.Models._CollectionFactory();

inna.Models.Hotels.HotelsCollection.prototype.getMinPrice = function(bundle){
    var min = Number.MAX_VALUE;

    this.each(function(hotel){
        var price = hotel.data.PackagePrice;

        if(bundle) {
            var vBundle = new inna.Models.Dynamic.Combination();
            vBundle.ticket = bundle.ticket;
            vBundle.hotel = hotel;

            price = vBundle.getFullPackagePrice();
        }

        if(price < min) min = price;
    });

    return min;
};

inna.Models.Hotels.HotelsCollection.prototype.getMaxPrice = function(){
    var max = 0;

    this.each(function(hotel){
        var price = hotel.data.PackagePrice;

        if(price > max) max= price;
    });

    return max;
};

inna.Models.Hotels.HotelsCollection.prototype.getVisibilityInfo = function(){
    var o = {}
    o.total = this.list.length
    o.visible = o.total;

    this.each(function(hotel){
        if(hotel.hidden || hotel.data.hidden) o.visible--;
    });

    return o;
};

inna.Models.Hotels.HotelsCollection.prototype.sort = function(sortingFn){
    this.list.sort(sortingFn);
}

inna.Models.Hotels.HotelsCollection.prototype.hasNext = function(hotel){
    return !!this.getNext(hotel);
}

inna.Models.Hotels.HotelsCollection.prototype.getNext = function(hotel){
    var index = this.list.indexOf(hotel);

    while(++index) {
        var next = this.list[index];

        if(!next) return null;

        if(!next.hidden && !next.data.hidden) return next;
    }

    return null;
}

inna.Models.Hotels.HotelsCollection.prototype.search = function(id){
    for(var i = 0, hotel = null; hotel = this.list[i++];) {
        if(hotel.data.HotelId == id) return hotel;
    }

    return null;
};

inna.Models.Hotels.HotelsCollection.prototype.drop = function(hotel){
    var index = this.list.indexOf(hotel);

    if(index !== -1) {
        this.list.splice(index, 1);
    }
};

inna.Models.Hotels.HotelsCollection.prototype.hideBundled = function(bundle) {
    var hotelId = bundle.hotel.data.HotelId;

    var hotel = this.search(hotelId);

    hotel && (hotel.hidden = true) && (hotel.data.hidden = true);
}

inna.Models.Hotels.Hotel = function(raw) {
    this.data = raw;
    this.data.hidden = false;

    if(this.data) {
        if(this.data.TaFactor) this.data.TaFactorCeiled = Math.ceil(this.data.TaFactor);
    }
};

inna.Models.Hotels.Hotel.prototype.setData = function (data) {
    this.data = angular.copy(data);
};

inna.Models.Hotels.Hotel.prototype.toJSON = function(){
    return this.data;
}

_.provide('inna.Models.Dynamic');

/**
 * Класс рекомендованного варианта
 * Может принемать обекты ticket и hotel
 * @param {Object} opt_param
 * @constructor
 */
inna.Models.Dynamic.Combination = function(opt_param){
    this.ticket = null;
    this.hotel = null;

    if(opt_param && (opt_param.ticket && opt_param.hotel)) {
        this.setTicket(opt_param.ticket);
        this.setHotel(opt_param.hotel);
    }
}

inna.Models.Dynamic.Combination.prototype.setTicket = function(ticket){
    this.ticket = ticket;
    this.setFullPackagePrice(this.ticket.data);
    this.setFullPrice(this.ticket.data);
}

inna.Models.Dynamic.Combination.prototype.setHotel = function(hotel) {
    this.hotel = hotel;
    this.setFullPackagePrice(this.hotel.data);
    this.setFullPrice(this.hotel.data);
}

inna.Models.Dynamic.Combination.prototype.parse = function(data){
    
}

inna.Models.Dynamic.Combination.prototype.setFullPackagePrice = function(data){
    this.FullPackagePrice = data.PackagePrice;
}

inna.Models.Dynamic.Combination.prototype.getFullPackagePrice = function(){
    return this.FullPackagePrice;
}

inna.Models.Dynamic.Combination.prototype.getFullTotalPriceNew = function(param){
    if(param == 'hotel'){
        return this.hotel.data.PriceObject;
    }
    if(param == 'ticket') {
        return this.ticket.data.PriceObject;
    }
}


inna.Models.Dynamic.Combination.prototype.getFullTotalPrice = function(){
    var tPrice = this.ticket.data.PriceObject;
    var hPrice = this.hotel.data.PriceObject;

    return {
        TotalAgentProfit: tPrice.TotalAgentProfit + hPrice.TotalAgentProfit + hPrice.TotalInnaAgentRate,
        TotalAgentRate: tPrice.TotalAgentRate + hPrice.TotalAgentRate,
        TotalAgentReward: tPrice.TotalAgentReward + hPrice.TotalAgentReward,
        TotalInnaProfit: tPrice.TotalInnaProfit + hPrice.TotalInnaProfit,
        TotalPrice: tPrice.TotalPrice + hPrice.TotalPrice,
        TotalInnaAgentRate : hPrice.TotalInnaAgentRate
    }
}


inna.Models.Dynamic.Combination.prototype.setFullPrice = function(data){
    this.FullPrice = data.Price;
}

inna.Models.Dynamic.Combination.prototype.getFullPrice = function(){
    return this.FullPrice;
}

inna.Models.Dynamic.Combination.prototype.getProfit = function(){
    return (this.getFullPackagePrice() - this.getFullPrice());
}

inna.Models.WlNewSearch = function (data) {
    var self = this;

    self.btnClick = function () {
        location.href = '/';
    }

    self.from = '';
    self.to = '';
    self.start = '';
    self.end = '';
    self.passengerCount = '';
    self.ticketClass = '';

    self.dateFilter = null;
    self.timeFormat = 'd MMMM';

    if (data != null) {
        if (data.dateFilter != null) {
            self.dateFilter = data.dateFilter;
        }
        if (data.from != null) {
            self.from = data.from;
        }
        if (data.to != null) {
            self.to = data.to;
        }
        if (data.start != null) {
            if (self.dateFilter){
                self.start = self.dateFilter(data.start, self.timeFormat);
            }
            else{
                self.start = data.start;
            }
        }
        if (data.end != null) {
            if (self.dateFilter) {
                self.end = self.dateFilter(data.end, self.timeFormat);
            }
            else {
                self.end = data.end;
            }
        }
        if (data.passengerCount != null) {
            self.passengerCount = data.passengerCount;
        }
        if (data.ticketClass != null) {
            try {
                data.ticketClass = parseInt(data.ticketClass);
            }
            catch (e) { };
            switch (data.ticketClass) {
                case 0: self.ticketClass = 'эконом'; break;
                case 1: self.ticketClass = 'бизнес'; break;
            }
        }
    }
}