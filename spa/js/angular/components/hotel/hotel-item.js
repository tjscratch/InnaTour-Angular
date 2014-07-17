angular.module('innaApp.conponents').
    factory('HotelItem', [
        '$filter',
        '$templateCache',
        'DynamicBlock',
        function ($filter, $templateCache, DynamicBlock) {

            var HotelItem = DynamicBlock.extend({
                template: $templateCache.get('components/dynamic-block/templ/base.galary.hbs.html'),
                append: true,
                data: {
                    settings : {
                        height : 200,
                        countColumn: 3,
                        classBlock : 'b-result_col_three_galary b-result_middle'
                    }
                },
                partials : {
                    collOneContent : '<div>1</div>',
                    collTwoContent : '<div>2</div>',
                    collThreeContent : '<div>3</div>'
                },

                init: function () {
                    var that = this;

                    console.log('item');

                    this.on({
                        change : function(data){

                        },
                        teardown: function (evt) {

                        }
                    })

                    /*this.observe('TaFactor', function(newValue, oldValue, keypath) {
                        if (newValue) {

                        }
                    });*/
                },

                parse: function (end) {

                }

            });

            return HotelItem;
        }]);

