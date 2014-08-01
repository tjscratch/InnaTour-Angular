angular.module('innaApp.conponents').
    factory('ClassFilter', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',
        'FilterSettings',
        function (EventManager, $filter, $templateCache, $routeParams, Events, FilterSettings) {

            var ClassFilter = Ractive.extend({
                data: {
                    isOpen: false,
                    value: null
                },
                init: function () {
                    var that = this;

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


