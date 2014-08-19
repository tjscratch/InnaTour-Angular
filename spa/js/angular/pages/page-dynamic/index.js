
innaAppControllers.
    controller('PageBuySuccess', [
        '$scope',
        '$rootScope',
        '$templateCache',
        '$routeParams',
        '$filter',
        'paymentService',
        'urlHelper',
        'aviaHelper',
        'innaApp.Urls',
        '$locale',

        // components
        'DynamicBlock',
        'Balloon',
        function ($scope, $rootScope, $templateCache, $routeParams, $filter, paymentService, urlHelper, aviaHelper, innaAppUrls, $locale, DynamicBlock, Balloon) {


            var Page = Ractive.extend({
                el: document.querySelector('.page-root'),
                template: $templateCache.get('pages/page-dynamic/templ/index.html'),

                partials: {

                },
                components: {

                },
                data: {
                    loadData: false
                },
                init: function () {

                    this.on({

                    })
                }
            });

            return new Page();
        }
    ]);
