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
                    title: '',
                    loading: false,
                    balloonContent: null,
                    balloonContentTest : '{{>balloonContent}}',
                    balloonClose: true,
                    isVisible: false,


                    /**
                     * Вызвать метод когда будет закрыт попап
                     * @override
                     */
                    callbackClose: function () {

                    },

                    /**
                     * кастомный метод, вызываем в своем шаблоне по требованию
                     * @override
                     */
                    callback: function () {

                    }
                },

                init: function (options) {
                    this._super(options);

                    this.on({
                        change: function (data) {

                        },
                        hide: this.hide,
                        changeTarifs: this.changeTarifs,
                        callback: function () {
                            this.get('callback')();
                            this.dispose();
                        },
                        teardown: function () {

                        }
                    });

                    this.observe('partial', function(){
                        this.set('reset', false);
                        this.set('reset', true);
                    })
                },

                partials: {
                    balloonContent: function () {
                        var templ = '<span></span>';
                        if (this.get('template'))
                            templ = $templateCache.get('components/balloon/templ/' + this.get('template'))

                        return templ;
                    },
                    loading: $templateCache.get('components/balloon/templ/loading.html')
                },


                /**
                 * Обновление шаблона balloon
                 * принемает все стандартные данные и дополнительные
                 *
                 *  template: - новый шаблон ( обновляет partials ),
                 *  title: 'Oops...',
                 *  balloonContent : - может быть как отдельный partials, так и просто html ( <div>test</div> )
                 *  content: 'Указанного заказа не существует',
                 *  callbackClose: function () {}
                 *
                 *
                 *  если есть content, то и должен быть отдельный template
                 * @param {Object} data
                 */
                updateView: function (data) {
                    if (data) {

                        var partial = '<span></span>';

                        if (data.template) {
                            partial = $templateCache.get('components/balloon/templ/' + data.template);
                        }

                        this.set({
                            partial : partial,
                            template : data.template,
                            loading: data.loading,
                            balloonContent: data.balloonContent,
                            title: data.title,
                            content: data.content,
                            callbackClose: data.callbackClose,
                            callback: data.callback
                        });


                        if (!this.get('isVisible')) {
                            this.show();
                        }
                    }
                },

                show: function () {
                    this.set({isVisible: true});
                },


                hide: function (evt) {
                    //evt.original.stopPropagation();
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
                },


                dispose: function () {
                    this.set({isVisible: false});
                }
            });

            return Balloon;
        }
    ]);
