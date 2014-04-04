innaAppServices.factory('DynamicPackagesCacheWizard', [
    function() {
        var PREFIX = 'DynamicPackagesCacheWizard__';

        var validators = {};

        validators.dateBegin = function(value){
            try{
                var date = Date.fromDDMMYY(value, true);

                return (date >= +(new Date()))
            } catch(e) {
                return false;
            }
        };

        validators.dateEnd = validators.dateBegin;

        var o = {
            require: function(key, ifNullCallback){
                var value = $.cookie(PREFIX + key) || null;

                value = o.validate(key, value);

                return o.notNull(value);
            },
            put: function(key, value){
                if(value !== null) {
                    $.cookie(PREFIX + key, value);
                } else {
                    o.drop(key);
                }

            },
            drop: function(key) {
                $.removeCookie(PREFIX + key);
            },
            validate: function(key, value){
                var validator = validators[key];

                if(!validator) return value;

                if(validator(value)) {
                    return value;
                } else {
                    o.drop(key);

                    return null;
                }
            },
            notNull: function(value, callback){
                if(value !== null || !callback) return value;
                else return callback();
            }
        }

        return o;
    }
]);