angular.module('innaApp.services')
    .factory('AjaxHelper', [
        function(){
            var ajax = {};
            var cache = {};

            function doAjax(options) {
                return $.ajax(options);
            }

            function buildOptions(url, data, method){
                return {
                    url: url,
                    type: method,
                    dataType: 'json',
                    traditional: true,
                    data: data,
                    headers: {
                        'X-Inna-Auth': $.cookie('x-inna-auth') || 'not-authorized'
                    }
                }
            }

            ajax.get = function(url, data, success, error){
                var request = doAjax(buildOptions(url, data, 'GET'));

                request.done(success).fail(error);

                return request;
            };

            ajax.post = function(url, data, success, error){
                var request = doAjax(buildOptions(url, data, 'POST'));

                request.done(success).fail(error);

                return request;
            };

            ajax.getDebounced = function(url, data, success, error){
                if(cache[url]) {
                    cache[url].abort();
                }

                return ajax.get(url, data, success, error);
            };

            ajax.postDebaunced = function(url, data, success, error){
                if(cache[url]) {
                    cache[url].abort();
                }

                return ajax.post(url, data, success, error);
            };

            return ajax;
        }
    ])