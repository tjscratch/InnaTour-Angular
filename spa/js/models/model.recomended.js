innaAppServices.factory('ModelRecommendedPair', [
    '$timeout',
    function ($timeout) {
        /**
         * Класс рекомендованного варианта
         * Может принемать обекты ticket и hotel
         * @param {Object} opt_param
         * @constructor
         */
        function Combination(opt_param){
            this.ticket = null;
            this.hotel = null;
            this.FullPackagePrice = 0;
            this.FullPrice = 0;
            this.CostPerPersonPrice = 0;
            this.StandartCostPerPersonPrice = 0;

            if(opt_param && (opt_param.ticket && opt_param.hotel)) {
                this.setTicket(opt_param.ticket);
                this.setHotel(opt_param.hotel);
            }
        }

        Combination.prototype.setTicket = function(ticket){
            this.ticket = ticket;
            this.setFullPackagePrice(this.ticket.data);
            this.setFullPrice(this.ticket.data);
            this.setCostPerPersonPrice(this.ticket.data);
        }

        Combination.prototype.setHotel = function(hotel) {
            this.hotel = hotel;
            this.setFullPackagePrice(this.hotel.data);
            this.setFullPrice(this.hotel.data);
            this.setCostPerPersonPrice(this.hotel.data);
            this.setStandartCostPerPersonPrice(this.hotel.data);
        }

        Combination.prototype.parse = function(data){

        }

        Combination.prototype.setFullPackagePrice = function(data){
            this.FullPackagePrice = data.PackagePrice;
        }

        Combination.prototype.setCostPerPersonPrice = function(data){
            this.CostPerPersonPrice = data.CostPerPerson;
        }

        Combination.prototype.setStandartCostPerPersonPrice = function(data){
            this.StandartCostPerPersonPrice = data.StandartCostPerPerson;
        }

        Combination.prototype.setRoom = function(data){
            this.hotel.data.Room = data;
        }

        Combination.prototype.getFullPackagePrice = function(){
            return this.FullPackagePrice;
        }

        Combination.prototype.getCostPerPersonPrice = function(){
            return this.CostPerPersonPrice;
        }

        Combination.prototype.getStandartCostPerPersonPrice = function(){
            return this.StandartCostPerPersonPrice;
        }

        Combination.prototype.getFullTotalPrice = function(){
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


        Combination.prototype.setFullPrice = function(data){
            this.FullPrice = data.Price;
        }

        Combination.prototype.getFullPrice = function(){
            return this.FullPrice;
        }

        Combination.prototype.getProfit = function(){
            var profit = (this.getFullPrice() - this.getFullPackagePrice());
            return profit;
        }

        return Combination;
    }
]);
