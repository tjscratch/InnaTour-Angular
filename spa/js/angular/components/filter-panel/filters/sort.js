angular.module('innaApp.conponents').
    factory('FilterSort', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            /**
             * Отдельный пункт сортировки
             */

            var SortedItem = Ractive.extend({
                // microtemplates
                template : "<li class='{{ selected ? 'current':''}}' data-val='{{value}}' on-click='selectSort'>{{name}}</li>",
                data : {
                    selected : false,
                    current : null
                },
                init : function(){
                    var that = this;

                    this.on({
                        selectSort : function(data){
                            this.set('selected', true);
                        },
                        unselected : function(){
                            this.set({ selected : false })
                        }
                    })

                    EventManager.on('sortChild:selected', function (childComponent) {
                        if (childComponent._guid != that._guid) {
                            that.set({ selected : false });
                        }
                    })

                }
            })


            var FilterSort = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/sort.hbs.html'),
                data: {
                    lowercaseFirst : $filter('lowercaseFirst'),
                    nameFilter : 'Sort',
                    sortValue : {
                        val : '',
                        fn : function(data){

                        }
                    }
                },
                components: {
                    SortedItem : SortedItem
                },
                init: function (options) {
                    this._super(options);
                    var that = this;

                    this.on({
                        selectSort : this.selectSort,
                        resetFilter: function () {
                            this.set('value.val', []);
                        }
                    })

                    var that = this;


                    // Слушаем события дочерних компонентов
                    this.findAllComponents().forEach(function (child) {

                        child.observe('selected', function (newValue, oldValue) {
                            if (newValue) {
                                that.set('sortValue',{
                                    current : child.get('name'),
                                    val : child.get('value')
                                })
                                EventManager.fire('sortChild:selected', child);
                            }
                        });
                    })
                },


                parse: function (end) {

                },

                beforeInit: function (data) {
                    //console.log('beforeInit');
                },

                complete: function (data) {

                }
            });

            return FilterSort;
        }]);


