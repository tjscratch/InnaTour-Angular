angular.module('innaApp.controllers')
    .controller('HelpPageController', [
        '$scope',
        '$templateCache',
        'HelpDataService',
        'ShareLink',
        '$location',
        function($scope, $templateCache, HelpDataService, ShareLink, $location){

            var toggler = Ractive.extend({
                debug: true,
                template: $templateCache.get('pages/page-help/templ/page-help-toggle.html'),
                data : {
                    visible : false,
                    openIf: null
                },
                components : {
                  share : ShareLink
                },
                init: function(){
                    this.on({
                        open: function(event){
                            this.set('visible', true);

                            var link = $(event.node).data('link');
                            $location.hash(link);
                        },
                        close: function(){
                            this.set('visible', false);
                            this.set('openIf', null);
                        }
                    });
                }
            });

            new (Ractive.extend({
                debug: true,
                el: document.querySelector('.page-help'),
                template: $templateCache.get('pages/page-help/templ/page-help.html'),
                data: {
                    topics: null,
                    link: $location.hash()
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