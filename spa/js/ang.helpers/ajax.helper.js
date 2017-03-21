angular.module('innaApp.services')
    .factory('AjaxHelper', [
        'EventManager',
        '$templateCache',
        'ErrorManager',
        'innaAppApiEvents',
        'guid',
        function (EventManager, $templateCache, ErrorManager, Events, guid) {
            var that = this;
            var ajax = {};
            var ajaxCollection = [];
            var cache = {};

            //this._errorManager = new ErrorManager();

            /**
             * Сбрасываем все ajax запросы
             */
            EventManager.on(Events.AJAX__RESET, function(){
                ajaxCollection.forEach(function(ajax){
                    ajax.abort();
                });

                ajaxCollection = [];
            });


            function doAjax(options) {

                var params = angular.extend({}, options);
                options = null;


                if(!params.data) {
                    params.data = {};
                }

                params.data.clientId = guid.setGuid();

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
                        if (params.preloader != undefined && params.preloader != null) {
                            params.preloader.show();
                        }
                    },
                    complete: function (data) {
                        // после любого ответа , уничтожаем прелоадер
                        if (params.preloader != undefined && params.preloader != null) {
                            params.preloader.dispose();
                        }
                    },
                    success: function (data) {
                        if (data && (data.error != undefined)) {
                            //that._errorManager.set({ errId: data.error.id });
                            return false
                        }

                        if (params.success && (typeof params.success == 'function')) {
                            params.success(data);
                        }
                    },
                    error: function (data) {
                        //that._errorManager.set({ errId : 500 });

                        /**
                         * Можно передать объект компонента Balloon
                         * для показа сообщения в случае ошибки
                         */
                        if (params.alert != undefined && params.alert != null) {
                            params.alert.show();
                        }

                        if (params.error && (typeof params.error == 'function')) {
                            params.error(data);
                        }

                        // отсылаем ошибки в sentry

                        /*if(data.statusText == 'Unauthorized') {
                            if (Raven) {
                                Raven.captureMessage('HTTP response error', {
                                    extra: {
                                        dataError: data
                                    }
                                });
                            }
                        }*/
                    }
                });

                ajaxCollection.push(async);
                //console.log(ajaxCollection, 'ajaxCollection');


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

            ajax.get = function (data) {
                return doAjax(data);
            };

            ajax.post = function (data) {
                data.type = 'POST';
                return doAjax(data);
            };

            /**
             *
             * @param {Object} params
             *  {
             *      url : url,
             *       data : data,
             *       success : success,
             *       error : error,
             *       cache : useCache,
             *       preloader : opt_preloader,
             *       alert : opt_alert
             *   }
             * @returns {*}
             */
            ajax.getDebounced = function (params) {
                if (cache[params.url]) {
                    cache[params.url].abort();
                }

                var req = ajax.get(params).always(function () {
                    delete cache[params.url];
                });

                cache[params.url] = req;

                return req;
            };

            ajax.postDebaunced = function (url, data, success, error, useCache, opt_preloader, opt_alert) {
                if (cache[url]) {
                    cache[url].abort();
                }

                var req = ajax.post({
                    url : url,
                    data : data,
                    success : success,
                    error : error,
                    cache : useCache,
                    preloader : opt_preloader,
                    alert : opt_alert
                }).always(function () {
                    delete cache[url];
                });

                cache[url] = req;

                return req;
            };


            return ajax;
        }
    ]);