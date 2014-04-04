innaAppServices.factory('DynamicPackagesCacheWizard', [
    function() {
        var PREFIX = 'DynamicPackagesCacheWizard__';

        var validators = {};

        var o = {
            require: function(key, ifNullCallback){
                var value = $.cookie(PREFIX + key) || null;

                if(validators[key]) {
                    if(validators[key](value)) {
                        return value;
                    } else {
                        o.drop(key);

                        return null;
                    }
                } else {
                    if(value === null && ifNullCallback) {
                        ifNullCallback();
                    } else {
                        return value;
                    }
                }
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
            }
        }

        return o;
    }
]);