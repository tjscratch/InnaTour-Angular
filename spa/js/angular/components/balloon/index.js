innaAppConponents.
    factory('Balloon', [
        'innaApp.API.events',
        '$templateCache',
        function (Events, $templateCache) {

            var Balloon = Ractive.extend({
                el: 'body',
                template: $templateCache.get('components/balloon/templ/index.html'),
                debug: true,
                append: true,
                data: {
                    // show close button
                    balloonClose: true,
                    isVisible: false,

                    //Вызвать метод когда будет закрыт попап
                    //@override
                    callbackClose: null
                },
                init: function (options) {
                    this._super(options);

                    this.on({
                        hide: this.hide,
                        changeTarifs: this.changeTarifs
                    });
                },

                partials: {
                    balloonContent: function () {
                        var templ = '<span></span>';
                        if (this.get('template'))
                            templ = $templateCache.get('components/balloon/templ/' + this.get('template'))

                        return templ;
                    }
                },

                show: function () {
                    this.set({isVisible: true});
                },
                hide: function () {
                    var that = this;

                    if (this.get('wait')) {
                        setTimeout(function () {
                            that.set({isVisible: false});
                            if (typeof that.get('callbackClose') == 'function') {
                                that.get('callbackClose')();
                            }
                        }, this.get('wait'))
                    } else {
                        that.set({isVisible: false});
                        if (typeof that.get('callbackClose') == 'function') {
                            that.get('callbackClose')();
                        }
                    }
                },

                toggleVisible: function () {
                    this.toggle('isVisible');
                },

                changeTarifs: function (evt) {

                    // переключаем класс current
                    $(evt.node).addClass('current').siblings().removeClass('current')

                    this.set({
                        from: evt.context.from,
                        to: evt.context.to,
                        _RULE_: evt.context.rule
                    });
                }
            });

            return Balloon;
        }
    ]);
