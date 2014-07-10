angular.module('innaApp.controllers')
    .controller('HelpPageController', [
        '$scope',
        '$templateCache',
        'HelpDataService',
        function($scope, $templateCache, HelpDataService){

            var toggler = Ractive.extend({
                debug: true,
                template: $templateCache.get('pages/page-help/templ/page-help-toggle.html'),
                data : {
                    visible : false
                },
                init: function(){

                    this.on({
                        toggleVisible : this.toggleVisible
                    })
                },
                toggleVisible : function(){
                    this.toggle('visible')
                }
            });

            new (Ractive.extend({
                debug: true,
                el: document.querySelector('.page-help'),
                template: $templateCache.get('pages/page-help/templ/page-help.html'),
                data: {
                    topics: null
                },
                components : {
                    Toggle : toggler
                },
                init: function(){
                    var self = this;

                    HelpDataService.fetchAll(function(data){
                        console.log(data);

                        self.set({
                            topics: data
                        })
                    });
                }
            }));
        }
    ]);