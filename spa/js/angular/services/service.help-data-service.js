angular.module('innaApp.services')
    .service('HelpDataService', [
        'innaApp.API.const',
        'AjaxHelper',
        function(urls, AjaxHelper){
            var cache = {};

            return {
                fetchAll: function(callback){
                    AjaxHelper.get({
                        url : urls.HELP_TOPICS,
                        data : {},
                        success : callback,
                        error : angular.noop,
                        cache : true
                    });
                }
            }
        }
    ]);