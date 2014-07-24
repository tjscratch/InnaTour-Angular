innaAppConponents.
    factory('DynamicBlock', [
        'innaApp.API.events',
        '$templateCache',
        '$filter',

        // components
        'Stars',
        'Tripadvisor',
        'PriceGeneric',
        function (Events, $templateCache, $filter, Stars, Tripadvisor, PriceGeneric) {

            var DynamicBlock = Ractive.extend({
                debug: true,
                template: $templateCache.get('components/dynamic-block/templ/base.hbs.html'),
                data : {

                    // настройки блока
                    // влияют на его визуальное отображение
                    settings : {
                        height : 220,
                        countColumn: 3
                    },
                    priceFilter: function (text) {
                        return $filter('price')(text);
                    }
                },
                partials : {
                    collOneContent : $templateCache.get('components/dynamic-block/templ/avia-dp.hbs.html'),
                    collTwoContent : $templateCache.get('components/dynamic-block/templ/hotel-dp.hbs.html'),
                    collThreeContent : $templateCache.get('components/dynamic-block/templ/combination-price.hbs.html'),

                    ruble: $templateCache.get('components/ruble.html')
                },
                components : {
                    Stars : Stars,
                    Tripadvisor : Tripadvisor,
                    PriceGeneric : PriceGeneric
                },

                init: function (options) {
                    this._super(options);
                },

                getHotelDetails : function(evt){

                }
            });

            return DynamicBlock;
        }
    ]);