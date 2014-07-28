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
                    value: null
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
                        toggle: function () {
                            this.toggle('isOpen')
                        },
                        show: function () {
                            this.set({ isOpen: true });
                        },
                        hide: function (opt_child) {
                            this.set({ isOpen: false });
                        },
                        change: function (data) {
                        },
                        teardown: function (evt) {
                            console.log('teardown filter all');
                            document.removeEventListener('click', this.bodyClickHide.bind(this), false);
                        }
                    })

                    // прокидываем сообщение до родителя о том что изменился какойто из фильтров
                    this.observe('value.val', function (newValue, oldValue) {
                        if(newValue) {
                            this._parent.fire('filter-panel:child:change', newValue)
                        }
                    });

                    // сортировка
                    this.observe('sortValue.val', function (newValue, oldValue) {
                        if(newValue) {
                            this._parent.fire('filter-panel:sort:change', newValue)
                        }
                    });
                },

                bodyClickHide: function (evt) {
                    evt.stopPropagation();
                    var $this = evt.target;

                    if (!this.find('.'+$this.classList[0])) {
                        if (this.get('isOpen') && !this.closest($this, '.filters__baloon')) {
                            this.fire('hide');
                        }
                    }
                },

                closest: function (elem, selector) {

                    while (elem) {
                        if (elem.matches && elem.matches(selector)) {
                            return true;
                        } else {
                            elem = elem.parentNode;
                        }
                    }
                    return false;
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


