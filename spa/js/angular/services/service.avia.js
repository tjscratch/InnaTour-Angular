innaAppServices.
    factory('aviaService', ['$log', '$timeout', 'innaApp.API.const', 'AjaxHelper',
        function ($log, $timeout, urls, AjaxHelper) {
            function log(msg) {
                $log.log(msg);
            }

            var PREFIX = "avia_cache_";
            var KEY = "form"

            return {
                getDirectoryByUrl: function (term, callbackSuccess, callbackError) {
                    AjaxHelper.get(urls.AVIA_FROM_SUGGEST, { term: term }, callbackSuccess, callbackError);
                },
                getObjectById: function (id, callbackSuccess, callbackError) {
                    AjaxHelper.get(urls.DYNAMIC_GET_OBJECT_BY_ID, { id: id }, callbackSuccess, callbackError);
                },
                saveForm: function(formItem) {
                    localStorage.setItem(PREFIX + KEY, formItem);
                },
                getForm: function() {
                    var formItem = localStorage.getItem(PREFIX + KEY) || null;
                    return formItem;
                },
                clearForm: function() {
                    localStorage.removeItem(PREFIX + KEY);
                },
                eof: null
            };
        }]);