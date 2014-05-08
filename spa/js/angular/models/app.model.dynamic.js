_.provide('inna.Models.Hotels');

inna.Models.Hotels.HotelsCollection = inna.Models._CollectionFactory();

inna.Models.Hotels.HotelsCollection.prototype.getMinPrice = function(){
    var min = Number.MAX_VALUE;

    this.each(function(hotel){
        var price = hotel.data.MinimalPackagePrice;

        if(price < min) min = price;
    });

    return min;
}

inna.Models.Hotels.Hotel = function(raw) {
    this.data = raw;
}

