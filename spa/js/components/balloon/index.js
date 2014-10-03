

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
                    balloonClose: true,
                    isVisible: false,
                    styleWidth : '',

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

                    utils.bindAll(this);

                    this.on({
                        change: function (data) {

                        },
                        hide: this.hide,
                        changeTarifs: this.changeTarifs,
                        callback: function () {
                            if (typeof this.get('callback') == 'function') {
                                this.get('callback')();
                            }

                            this.dispose();
                        },
                        teardown: function () {

                        }
                    });

                    this.observe('partialUpdate', function () {
                        this.set('reset', false);
                        this.set('reset', true);
                    })

                    this.observe('isVisible', function (value) {
                        if(value){
                            document.body.classList.add('overflow_hidden');
                            window.addEventListener('resize', onResize);
                        } else {
                            document.body.classList.remove('overflow_hidden');
                            window.removeEventListener('resize', onResize);
                        }
                    })

                    function onResize(){
                        this.set('styleWidth', document.documentElement.clientWidth);
                    }

                },

                beforeInit: function(o){
                    if(o && o.data && o.data.template) {
                        this.data.partialUpdate = $templateCache.get('components/balloon/templ/' + o.data.template);
                    }
                },


                partials: {
                    balloonContent: function () {
                        var templ = '<span></span>';
                        if (this.get('balloonPart'))
                            templ = $templateCache.get('components/balloon/templ/' + this.get('balloonPart'))

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
                        this.dispose();

                        var partial = '<span></span>';

                        if (data.template) {
                            partial = $templateCache.get('components/balloon/templ/' + data.template);
                            this.partials.partialUpdate = partial;
                        }

                        this.set({
                            partialUpdate: partial,
                            template: data.template,
                            loading: data.loading || false,
                            balloonClose: data.balloonClose,
                            balloonContent: data.balloonContent,
                            title: data.title,
                            content: data.content,
                            callbackClose: data.callbackClose || null,
                            callback: data.callback || null
                        });


                        if (!this.get('isVisible')) {
                            this.show();
                        }
                    }
                },

                show: function () {
                    var that = this;
                    this.set({
                        isVisible: true,
                        styleWidth : document.documentElement.clientWidth
                    });
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
