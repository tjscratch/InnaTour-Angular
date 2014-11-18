innaAppServices.factory('ModelPrice', function () {

    var Price = function(packageData){
        this.data = packageData.data
    }

    Price.prototype.getProfit = function () {
        var profit = (this.data.Price - this.data.PackagePrice)
        return  profit;
    }

    return Price;
});