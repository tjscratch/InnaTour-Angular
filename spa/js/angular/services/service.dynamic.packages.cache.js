innaAppServices.factory('DynamicPackagesCacheWizard', [
    function(){
        var PREFIX = 'DynamicPackagesCacheWizard__';

        return {
            require: function(key){
                return $.cookie(PREFIX + key) || null;
            },
            put: function(key, value){
                $.cookie(PREFIX + key, value);
            }
        }
    }
]);