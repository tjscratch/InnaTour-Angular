innaAppServices.factory('ModelHotel', [
    '$timeout',
    'ModelHotelsCollection',
    'ModelRecommendedPair',
    function ($timeout, ModelHotelsCollection, ModelRecommendedPair) {

        var Hotels = ModelHotelsCollection;

        Hotels.Hotel = function (raw) {
            this.data = raw;
            this.data.hidden = false;

            if (this.data) {
                if (this.data.TaFactor) this.data.TaFactorCeiled = Math.ceil(this.data.TaFactor);
            }
        };

        Hotels.Hotel.prototype.setData = function (data) {
            this.data = angular.copy(data);
        };

        Hotels.Hotel.prototype.toJSON = function () {
            return this.data;
        }

        return Hotels.Hotel;
    }
]);