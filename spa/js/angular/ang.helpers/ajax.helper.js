angular.module('innaApp.services')
    .factory('AjaxHelper', [
        '$templateCache',
        'ErrorManager',
        function ($templateCache, ErrorManager) {
            var that = this;
            var ajax = {};
            var cache = {};

            this._errorManager = new ErrorManager();


            function doAjax(options) {
                var params = angular.extend({}, options);
                options = null;


                if(!params.data) {
                    params.data = {};
                }

                if (typeof params.cache !== 'undefined') {
                    angular.extend(params, {cache: cache});
                }

                var async = $.ajax({
                    url: params.url,
                    type: params.type,
                    dataType: 'json',
                    cache : params.cache || false,
                    traditional: !hasObjects(params.data),
                    data: params.data,
                    //xhrFields: { withCredentials: true },
                    //crossDomain: true,
                    eol: null,
                    beforeSend: function () {

                        // перед отправкой показываем прелоадер
                        if (params.preloader != undefined) {
                            params.preloader.show();
                        }
                    },
                    complete: function (data) {
                        // после любого ответа , уничтожаем прелоадер
                        if (params.preloader != undefined) {
                            params.preloader.dispose();
                        }
                    },
                    success: function (data) {


                        if (!data || (data == null)) {
                            that._errorManager.set({ errId: 1 });
                            return false
                        }

                        if (data && (data.error != undefined)) {
                            that._errorManager.set({ errId: data.error.id });
                            return false
                        }

                        if (params.success && (typeof params.success == 'function')) {
                            params.success(data);
                        }
                    },
                    error: function (data) {
                        //that._errorManager.set({ errId : 500 });

                        if (params.error && (typeof params.error == 'function')) {
                            params.error(data);
                        }
                    }
                });

                return async;
            }

            function hasObjects(data) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (_.isObject(data[key])) return true;
                    }
                }
                return false;
            }

            ajax.http = doAjax;

            ajax.cancelRequest = function (url) {
                if (cache[url]) {
                    cache[url].abort();
                }
            };

            ajax.getCancelable = function (url, data, success, error) {

                var request = doAjax({
                    url: url,
                    data: data,
                    type: 'GET',
                    cache: false,
                    success: success,
                    error: error
                });

                request.always(function () {
                    delete cache[url];
                });

                cache[url] = request;

                return request;
            };

            ajax.getNoCache = function (url, data, success, error) {
                return doAjax({
                    url: url,
                    data: data,
                    type: 'GET',
                    cache: false,
                    success: success,
                    error: error
                });
            };

            ajax.get = function (url, data, success, error, useCache) {
                return doAjax({
                    url: url,
                    data: data,
                    type: 'GET',
                    cache: useCache,
                    success: success,
                    error: error
                });
            };

            ajax.post = function (url, data, success, error, useCache) {
                return doAjax({
                    url: url,
                    data: data,
                    type: 'POST',
                    cache: useCache,
                    success: success,
                    error: error
                });
            };

            ajax.getDebounced = function (url, data, success, error, useCache) {
                if (cache[url]) {
                    cache[url].abort();
                }

                var req = ajax.get(url, data, success, error, useCache).always(function () {
                    delete cache[url];
                });

                cache[url] = req;

                return req;
            };

            ajax.postDebaunced = function (url, data, success, error, useCache) {
                if (cache[url]) {
                    cache[url].abort();
                }

                var req = ajax.post(url, data, success, error, useCache).always(function () {
                    delete cache[url];
                });

                cache[url] = req;

                return req;
            };

            return ajax;
        }
    ]);



/*angular.module('innaApp.services')
 .factory('AjaxHelper', [
 function(){
 var ajax = {};
 var cache = {};

 function doAjax(options) {
 return $.ajax(options);
 }

 function buildOptions(url, data, method, useCache) {
 var o = {
 url: url,
 type: method,
 dataType: 'json',
 traditional: !hasObjects(data),
 data: data,
 //xhrFields: { withCredentials: true },
 //crossDomain: true,
 //async: typeof async !== 'undefined' ? async : true,
 eol: null
 };

 if (typeof useCache !== 'undefined'){
 o.cache = useCache;
 }

 //if (async == false) {
 //    //при синхронных вызовах последний FF ругается и блочит запрос, нужно удалить withCredentials
 //    delete o.xhrFields;
 //}
 return o;
 }

 function hasObjects(data) {
 for(var key in data) if(data.hasOwnProperty(key)){
 if(_.isObject(data[key])) return true;
 }

 return false;
 }

 ajax.cancelRequest = function (url) {
 if (cache[url]) {
 cache[url].abort();
 }
 };

 ajax.getCancelable = function (url, data, success, error) {
 var request = doAjax(buildOptions(url, data, 'GET', false));

 request.done(success || angular.noop).fail(error || angular.noop).always(function () {
 delete cache[url];
 });

 cache[url] = request;

 return request;
 };

 ajax.getNoCache = function (url, data, success, error) {
 var request = doAjax(buildOptions(url, data, 'GET', false));

 request.done(success || angular.noop).fail(error || angular.noop);

 return request;
 };

 ajax.get = function (url, data, success, error, useCache) {
 var request = doAjax(buildOptions(url, data, 'GET', useCache));

 request.done(success || angular.noop).fail(error || angular.noop);

 return request;
 };

 ajax.post = function (url, data, success, error, useCache) {
 var request = doAjax(buildOptions(url, data, 'POST', useCache));

 request.done(success || angular.noop).fail(error || angular.noop);

 return request;
 };

 ajax.getDebounced = function (url, data, success, error, useCache) {
 if(cache[url]) {
 cache[url].abort();
 }

 var req = ajax.get(url, data, success, error, useCache).always(function () {
 delete cache[url];
 });

 cache[url] = req;

 return req;
 };

 ajax.postDebaunced = function (url, data, success, error, useCache) {
 if(cache[url]) {
 cache[url].abort();
 }

 var req = ajax.post(url, data, success, error, useCache).always(function () {
 delete cache[url];
 });

 cache[url] = req;

 return req;
 };

 return ajax;
 }
 ]);*/