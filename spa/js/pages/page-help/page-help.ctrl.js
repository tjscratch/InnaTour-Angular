angular.module('innaApp.controllers')
    .controller('HelpPageController', [
        '$scope',
        '$templateCache',
        'HelpDataService',
        'ShareLink',
        '$location',
        'innaApp.Urls',
        function($scope, $templateCache, HelpDataService, ShareLink, $location, Urls){
            var EVENT_OPEN = 'OPEN';
            var hash = $location.hash();

            var mediator = new Ractive();

            var toggler = Ractive.extend({
                debug: true,
                template: $templateCache.get('pages/page-help/templ/page-help-toggle.hbs.html'),
                data : {
                    visible : false,
                    openIf: null,
                    location : location.host+'/#'+Urls.URL_HELP,
                    right : true,
                    class: "b-tooltip-share__button-default"
                },
                components : {
                    ShareLink : ShareLink
                },
                onrender: function(){
                    this.on({
                        open: this.open,
                        close: this.close
                    });

                },

                open: function(event){
                    mediator.fire(EVENT_OPEN, this);

                    this.set('visible', true);

                    var link = $(event.node).data('link');
                    $location.hash(link);
                },
                close: function(){
                    this.set('visible', false);
                    this.set('openIf', null);

                    $location.hash('');
                }
            });

            var Page = Ractive.extend({
                debug: true,
                el: document.querySelector('.page-help'),
                template: $templateCache.get('pages/page-help/templ/page-help.hbs.html'),
                data: {
                    topics: null,
                    link: hash
                },
                components : {
                    Toggle : toggler
                },
                onrender: function(){
                    var self = this;

                    HelpDataService.fetchAll(function(data){
                        self.set({
                            topics: data
                        });

                        var offsetTop = 0;
                        var dataLink  = self.find('[data-link="' + hash + '"]');

                        if(dataLink) {
                            var el = $(dataLink);
                            offsetTop = parseInt(el.offset().top);
                        }
                        document.documentElement.scrollTop = document.body.scrollTop = offsetTop - 120;
                    });

                    mediator.on(EVENT_OPEN, function(target){
                        self.findAllComponents('Toggle').forEach(function(toggler){
                            toggler !== target && toggler.close();
                        });
                    });
                }
            });

            new Page()
        }
    ]);