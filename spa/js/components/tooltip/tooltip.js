angular.module('innaApp.components').
    factory('TooltipBase', [
        '$filter',
        '$templateCache',
        function ($filter, $templateCache) {

            var EventManager = new Ractive();

            var TooltipBase = Ractive.extend({
                append: true,
                data: {
                    isVisible: false
                },
                onrender: function () {
                    var that = this;

                    function bodyClickShareLink(evt) {
                        var $this = evt.target;

                        if($this.classList) {
                            if (!that.find('.' + $this.classList[0])) {
                                that.hide();
                            }
                        }
                    };

                    this.on({
                        toggleShow: this.toggleShow,
                        hide: this.hide,
                        show: this.show,
                        teardown: function (evt) {
                            document.removeEventListener('click', bodyClickShareLink, false);
                        }
                    });

                    // прячем все остальные tooltip
                    EventManager.on('tooltip:hide', function(data){
                        if(data._guid != that._guid) {
                            that.hide();
                        }
                    });

                    // по клику в любом месте кроме компонента
                    // прячем его
                    document.addEventListener('click', bodyClickShareLink, false);

                    this.observe('isVisible', function (newValue, oldValue) {
                        if (newValue) EventManager.fire( 'tooltip:hide', this);
                    });
                },
                show: function (evt) {
                    this.set({'isVisible': true});
                },

                hide: function (evt) {
                    this.set({'isVisible': false});
                },

                toggleShow: function (evt) {
                    if (evt && evt.original) {
                        evt.original.preventDefault();
                        evt.original.stopPropagation();
                    }
                    this.toggle('isVisible');
                }
            });

            return TooltipBase;
        }]);

