angular.module('innaApp.services')
    .factory('AjaxHelper', [
        function(){
            var ajax = {};
            var cache = {};

            function doAjax(options) {
                return $.ajax(options);
            }

            function buildOptions(url, data, method, async) {
                return {
                    url: url,
                    type: method,
                    dataType: 'json',
                    traditional: true,
                    data: data,
                    xhrFields: { withCredentials: true },
                    crossDomain: true,
                    async: async != null ? async : true,//по-умолчанию true

                    eol: null
                }
            }

            ajax.get = function (url, data, success, error, async) {
                var request = doAjax(buildOptions(url, data, 'GET', async));

                request.done(success).fail(error);

                return request;
            };

            ajax.post = function (url, data, success, error, async) {
                var request = doAjax(buildOptions(url, data, 'POST', async));

                request.done(success).fail(error);

                return request;
            };

            ajax.getDebounced = function (url, data, success, error, async) {
                if(cache[url]) {
                    cache[url].abort();
                }

                return ajax.get(url, data, success, error, async);
            };

            ajax.postDebaunced = function (url, data, success, error, async) {
                if(cache[url]) {
                    cache[url].abort();
                }

                return ajax.post(url, data, success, error, async);
            };

            return ajax;
        }
    ])