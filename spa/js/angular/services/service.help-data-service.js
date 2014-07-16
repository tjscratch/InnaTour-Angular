angular.module('innaApp.services')
    .service('HelpDataService', [
        'innaApp.API.const',
        'AjaxHelper',
        function(urls, AjaxHelper){
            var cache = {};

            return {
                fetchAll: function(callback){
                    AjaxHelper.get(urls.HELP_TOPICS, {}, callback, angular.noop, true);
                }
            }
        }
    ]);