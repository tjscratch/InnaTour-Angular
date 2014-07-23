angular.module('innaApp.conponents').
    factory('ClassFilter', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',
        function (EventManager, $filter, $templateCache, $routeParams, Events) {

            var ClassFilter = Ractive.extend({
                data: {
                    isOpen: false,

                    // значение фильтра
                    value : null
                },
                init: function () {
                    var that = this;

                    /**
                     * Прокидываем напрямую данные для фильтров
                     * Получается что все данные будут доступны без filtersData
                     */
                    this.set(this.get('data'))

                    document.addEventListener('click', this.bodyClickHide.bind(this), false);

                    /**
                     * Events
                     */
                    this.on({
                        toggle : function(){
                            this.toggle('isOpen')
                        },
                        show: function () {
                            this.set({ isOpen: true });
                        },
                        hide: function (opt_child) {
                            this.set({ isOpen: false });
                        },
                        resetFilter : function(){
                          console.log('reset');
                        },
                        change: function (data) {

                        },
                        teardown: function (evt) {
                            console.log('teardown filter all');
                            document.removeEventListener('click', this.bodyClickHide.bind(this), false);
                        }
                    })
                },

                bodyClickHide : function(evt){
                    var $this = evt.target;

                    //console.log($this, evt, this);
                    //console.log(this.find($this));
                    /*if (!this.find('.' + $this.classList[0])) {
                        //this.fire('hide');
                    }*/
                },


                beforeInit: function (data) {
                    //console.log('beforeInit');
                },

                complete: function (data) {
                    //console.log('complete');
                }
            });

            return ClassFilter;
        }]);


