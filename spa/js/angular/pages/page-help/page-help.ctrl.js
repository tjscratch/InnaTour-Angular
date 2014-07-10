angular.module('innaApp.controllers')
    .controller('HelpPageController', [
        '$scope',
        '$templateCache',
        'HelpDataService',
        function($scope, $templateCache, HelpDataService){
            new (Ractive.extend({
                debug: true,
                el: document.querySelector('.page-help'),
                template: $templateCache.get('pages/page-help/templ/page-help.html'),
                init: function(){
                    var self = this;

                    HelpDataService.fetchAll(function(data){
                        console.log(data);
                    });
                }
            }));
        }
    ]);