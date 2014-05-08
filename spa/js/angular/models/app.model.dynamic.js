_.provide('inna.Models.Hotels');

inna.Models.Hotels.HotelsCollection = inna.Models._CollectionFactory();

inna.Models.Hotels.HotelsCollection.prototype.getMinPrice = function(){
    var min = Number.MAX_VALUE;

    this.each(function(hotel){
        var price = hotel.data.MinimalPackagePrice;

        if(price < min) min = price;
    });

    return min;
};

inna.Models.Hotels.HotelsCollection.prototype.getMaxPrice = function(){
    var max = 0;

    this.each(function(hotel){
        var price = hotel.data.MinimalPackagePrice;

        if(price > max) max= price;
    });

    return max;
}

inna.Models.Hotels.Hotel = function(raw) {
    this.data = raw;
}

