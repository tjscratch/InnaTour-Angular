innaAppServices.
    factory('aviaService', ['$log', '$timeout', 'innaApp.API.const', 'AjaxHelper',
        function ($log, $timeout, urls, AjaxHelper) {
            function log(msg) {
                $log.log(msg);
            }

            return {
                getDirectoryByUrl: function (term, callbackSuccess, callbackError) {
                    AjaxHelper.getDebounced(urls.AVIA_FROM_SUGGEST, { term: term }, callbackSuccess, callbackError);
                },
                getObjectById: function (id, callbackSuccess, callbackError, async) {
                    AjaxHelper.getDebounced(urls.DYNAMIC_GET_OBJECT_BY_ID, { id: id }, callbackSuccess, callbackError, async);
                },
                eof: null
            };
        }]);