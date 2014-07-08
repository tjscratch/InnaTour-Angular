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
                    balloonClose: true
                },
                init: function () {
                    this._overlay = this.find('.js-overlay');
                    this._balloon = this.find('.js-b-balloon');


                    this.on({
                        hide: this.hide,
                        changeTarifs: this.changeTarifs
                    })
                },
                show: function () {
                    this._overlay.style.display = 'block';
                    this._balloon.style.display = 'block';
                },
                hide: function () {
                    this._overlay.style.display = 'none';
                    this._balloon.style.display = 'none';
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
