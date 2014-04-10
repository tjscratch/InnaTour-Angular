var DynamicModels = {
    __expand: function(data, reduction){
        for(var prop in data) if(data.hasOwnProperty(prop)) {
            if(_.isObject(data[prop])){
                this[reduction[prop]] = {};
                DynamicModels.__expand.call(this[reduction[prop]], data[prop]);
            } else {
                this[reduction[prop]] = data[prop];
            }
        }
    }
};

DynamicModels.Hotel = function(data, reduction){ DynamicModels.__expand.call(this, data, reduction); }

DynamicModels.Combination = function(data, reduction){ DynamicModels.__expand.call(this, data, reduction); }

DynamicModels.Ticket = function(data, reduction){ DynamicModels.__expand.call(this, data, reduction); }
