innaAppServices.
    factory('aviaService', ['$log', '$timeout', 'innaApp.API.const', 'AjaxHelper',
        function ($log, $timeout, urls, AjaxHelper) {
            function log(msg) {
                $log.log(msg);
            }

            var PREFIX = "avia_cache_";
            var KEY = "form";

            return {
                getDirectoryByUrl: function (term, callbackSuccess, callbackError) {
                    AjaxHelper.get({
                        url: urls.AVIA_FROM_SUGGEST,
                        data: { term: term },
                        success: callbackSuccess,
                        error: callbackError
                    });
                },
                getObjectById: function (id, callbackSuccess, callbackError) {
                    AjaxHelper.get({
                        url: urls.DYNAMIC_GET_OBJECT_BY_ID,
                        data: { id: id },
                        success: callbackSuccess,
                        error: callbackError
                    });

                },
                saveForm: function (formItem) {
                    localStorage.setItem(PREFIX + KEY, formItem);
                },
                getForm: function () {
                    var formItem = localStorage.getItem(PREFIX + KEY) || null;
                    return formItem;
                },
                clearForm: function () {
                    localStorage.removeItem(PREFIX + KEY);
                },
                getGetCurrentCity: function (callbackSuccess, callbackError) {
                    AjaxHelper.get({
                        url: urls.DYNAMIC_GET_DIRECTORY_BY_IP,
                        data: null,
                        success: callbackSuccess,
                        error: callbackError
                    });
                },
                eof: null
            };
        }]);