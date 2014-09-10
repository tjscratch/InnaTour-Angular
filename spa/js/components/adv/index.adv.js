

innaAppConponents.
    factory('ADVComponent', [
        'EventManager',
        'innaApp.API.events',
        '$templateCache',
        '$routeParams',
        '$location',
        function (EventManager, Events, $templateCache, $routeParams, $location) {

            var ADV = Ractive.extend({
                el: document.querySelector('.main'),
                template: $templateCache.get('components/adv/templ/index.adv.hbs.html'),
                debug: true,
                append: true,
                data: {
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

                    this.determine();


                    this.on({
                        change: function (data) {

                        },
                        hide: this.hide,

                        teardown: function () {

                        }
                    });

                    this.observe('isVisible', function (value) {
                        if(value){

                        } else {

                        }
                    })
                },


                partials: {
                    partContent: function () {
                        var templ = '<span></span>';
                        if (this.get('advContent'))
                            templ = $templateCache.get('components/adv/templ/' + this.get('advContent'))

                        return templ;
                    }
                },

                determine : function(){
                    if($location.search().adv){
                        document.body.classList.add('adv-inject');
                    }
                },

                show: function () {
                    this.set({
                        isVisible: true
                    });
                },


                hide: function (evt) {
                    this.set({isVisible: false});
                },

                toggleVisible: function () {
                    this.toggle('isVisible');
                },

                dispose: function () {
                    this.set({isVisible: false});
                }
            });

            return ADV;
        }
    ]);
