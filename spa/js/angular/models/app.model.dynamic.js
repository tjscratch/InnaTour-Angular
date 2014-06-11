_.provide('inna.Models.Hotels');

inna.Models.Hotels.HotelsCollection = inna.Models._CollectionFactory();

inna.Models.Hotels.HotelsCollection.prototype.getMinPrice = function(){
    var min = Number.MAX_VALUE;

    this.each(function(hotel){
        var price = hotel.data.PackagePrice;

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
        if(hotel.hidden) o.visible--;
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

        if(!next.hidden) return next;
    }

    return null;
}

inna.Models.Hotels.HotelsCollection.prototype.search = function(id){
    for(var i = 0, hotel = null; hotel = this.list[i++];) {
        if(hotel.data.HotelId == id) return hotel;
    }

    return null;
}

inna.Models.Hotels.HotelsCollection.prototype.drop = function(hotel){
    var index = this.list.indexOf(hotel);

    if(index !== -1) {
        this.list.splice(index, 1);
    }
};

inna.Models.Hotels.Hotel = function(raw) {
    this.data = raw;

    this.data.CheckIn = dateHelper.apiDateToJsDate(this.data.CheckIn);
    this.data.CheckOut = dateHelper.apiDateToJsDate(this.data.CheckOut);
};

inna.Models.Hotels.Hotel.prototype.toJSON = function(){
    return this.data;
}

_.provide('inna.Models.Dynamic');

inna.Models.Dynamic.Combination = function(){
    this.ticket = null;
    this.hotel = null;
}

inna.Models.Dynamic.Combination.prototype.setTicket = function(ticket){
    this.ticket = ticket;
}

inna.Models.Dynamic.Combination.prototype.setHotel = function(hotel) {
    this.hotel = hotel;
}

inna.Models.Dynamic.Combination.prototype.parse = function(data){
    
}

inna.Models.Dynamic.Combination.prototype.getFullPackagePrice = function(){
    return +this.ticket.data.PackagePrice + +this.hotel.data.PackagePrice;
}

inna.Models.Dynamic.Combination.prototype.getFullTotalPrice = function(){
    var tPrice = this.ticket.data.PriceObject
    var hPrice = this.hotel.data.PriceObject;

    return {
        TotalAgentProfit: tPrice.TotalAgentProfit + hPrice.TotalAgentProfit,
        TotalAgentRate: tPrice.TotalAgentRate + hPrice.TotalAgentRate,
        TotalAgentReward: tPrice.TotalAgentReward + hPrice.TotalAgentReward,
        TotalInnaProfit: tPrice.TotalInnaProfit + hPrice.TotalInnaProfit,
        TotalPrice: tPrice.TotalPrice + hPrice.TotalPrice
    }
}

inna.Models.Dynamic.Combination.prototype.getFullPrice = function(){
    return +this.ticket.data.Price + +this.hotel.data.Price;
}