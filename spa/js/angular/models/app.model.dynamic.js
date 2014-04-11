var DynamicModels = {
    __expand: function(data){
        for(var prop in data) if(data.hasOwnProperty(prop)) {
            this[prop] = data[prop];
        }
    }
};

DynamicModels.Hotel = function(data){ DynamicModels.__expand.call(this, data); }

DynamicModels.Combination = function(data){ DynamicModels.__expand.call(this, data); }

DynamicModels.Ticket = function(data){ DynamicModels.__expand.call(this, data); }
