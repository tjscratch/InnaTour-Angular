angular.module('innaApp.components').
    factory('ClassFilter', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',
        function (EventManager, $filter, $templateCache, $routeParams, Events) {

            var ClassFilter = Ractive.extend({
                data: {
                    clearTimeHover: null,
                    isOpen: false,
                    hasSelected: false,
                    value: null
                },
                init: function () {
                    var that = this;
                    this.SaveData = [];

                    this.on({
                        toggle: function (evt) {
                            if (evt && evt.original)
                                evt.original.stopPropagation();

                            this.toggle('isOpen')
                        },
                        show: function () {
                            this.set({ isOpen: true });
                        },
                        hide: function (opt_child) {
                            this.set({ isOpen: false });
                        },
                        resetFilter: function (opt_silent) {
                            if (!this.get('sortValue')) {
                                this.set({
                                    'value.val': [],
                                    'hasSelected': false
                                });

                                if (opt_silent && opt_silent.silent) {
                                    console.log('silent reset');
                                } else {
                                    this._parent.fire('changeChildFilter', this.get('value.val'));
                                }

                                that.SaveData = [];
                            }

                        },
                        onHover: function (evt) {
                            clearTimeout(this.get('clearTimeHover'));

                            if (!evt.hover) {
                                var time = setTimeout(function () {
                                    that.fire('hide')
                                }, 500);
                                this.set('clearTimeHover', time);
                            }
                        },
                        filtersItemRemove: this.IndicatorFiltersItemRemove,
                        teardown: function (evt) {
                            //console.log('teardown child');
                        }
                    })


                    this.observe('updateModel', function (value) {
                        this.mergeData();
                    }, {init: false});
                },

                hasSelected: function () {
                    if (this.get('value.val') && this.get('value.val').length) {
                        this.set('hasSelected', true);
                    } else {
                        this.set('hasSelected', false);
                    }
                },

                spliceValue : function(){
                    //this.splice('value.val', this.get('value.val').indexOf(data.context.Value), 1);
                },

                /**
                 * @param data
                 * @override
                 */
                IndicatorFiltersItemRemove: function (data) {

                },

                /**
                 * @override
                 */
                mergeData: function () {
                    var that = this;

                    if (this.SaveData.length && this.get('FilterData.List').length) {

                        this.get('FilterData.List').forEach(function (item, i) {

                            that.SaveData.filter(function (saveItem) {
                                if (item.Value == saveItem.Value) {
                                    that.set('FilterData.List.' + i, angular.extend(saveItem, item));
                                    that.push('value.val', saveItem.Value);
                                    return true;
                                }
                            });
                        });
                    }
                },

                /**
                 * @param context
                 * @override
                 */
                spliceSaveData: function (context) {
                    var that = this;

                    if (this.SaveData.length) {
                        this.SaveData.forEach(function (item, i) {
                            if (context.Value == item.Value) {
                                that.SaveData.splice(i, 1);
                            }
                        });
                    }
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


