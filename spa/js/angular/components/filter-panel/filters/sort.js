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
                template : "<li class='{{ selected ? 'current':''}}' on-click='selectSort'>{{name}}</li>",
                data : {
                    selected : false,
                    current : null
                },
                init : function(){
                    this.on({
                        selectSort : function(data){
                            this.set({
                                current : this.get('name'),
                                selected : true
                            });
                        },
                        unselected : function(){
                            this.set({ selected : false })
                        }
                    })

                }
            })


            var FilterSort = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/sort.hbs.html'),
                data: {
                    lowercaseFirst : $filter('lowercaseFirst')
                },
                components: {
                    SortedItem : SortedItem
                },
                init: function (options) {
                    this._super(options);
                    var that = this;

                    this.on({
                        selectSort : this.selectSort
                    })

                    var that = this;


                    // Слушаем события дочерних компонентов
                    this.findAllComponents().forEach(function (child) {

                        child.observe('selected', function (newValue, oldValue) {
                            if (newValue) {
                                that.set({current : child.get('current')})
                                that.fire('sortChild:selected', child);
                            }
                        });

                        child._parent.on('sortChild:selected', function (childComponent) {
                            if (childComponent._guid != child._guid) {
                                child.fire('unselected');
                            }
                        })
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


