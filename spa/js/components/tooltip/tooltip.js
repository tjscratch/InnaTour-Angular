angular.module('innaApp.components').
    factory('TooltipBase', [
        '$filter',
        '$templateCache',
        function ($filter, $templateCache) {

            var EventManager = new Ractive();

            var TooltipBase = Ractive.extend({
                template: '{{>element}}',
                append: true,
                data: {
                    tooltipKlass : '',
                    contentHTML : '',
                    condition : function(){},
                    isVisible: false,
                    position : "",
                    style : ''
                },

                computed: {
                    stylePosition: {
                        get: function(){
                            var style = '';
                            var pos = '';

                            switch(this.get('position')){
                                case 'right':
                                    pos = this.get('position')+":-"+this.get('width')+"px;";
                                    break;
                                case 'left':
                                    pos = ''
                                    break;
                                case 'top':
                                    pos = ''
                                    break;
                                case 'bottom':
                                    pos = ''
                                    break;
                            }

                            style = "width:"+ this.get('width') +"px;"+pos;
                            return style;
                        },
                        set: function ( params ) {
                            this.set('width', params.width);
                        }
                    }
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
                        if (newValue) {
                            EventManager.fire( 'tooltip:hide', this);

                            this.computedStyle();
                        }
                    });
                },

                partials: {
                    element: function () {
                        var templ = '<span></span>';

                        if (this.get('template')) {
                            templ = $templateCache.get('components/tooltip/templ/' + this.get('template'));
                        } else {
                            templ = $templateCache.get('components/tooltip/templ/empty.hbs.html');
                        }
                        return templ;
                    }
                },

                computedStyle : function(){
                    if(this.get('position')) {
                        var style = {
                            width : $(this.find('.tooltip')).width()
                        };
                        this.set('stylePosition', style);
                    }
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
                },

                // dynamic template
                setTemplate: function (options) {
                    var templ = '';

                    if (options.data.template) {
                        templ = $templateCache.get('components/tooltip/templ/' + options.data.template);
                    } else {
                        templ = $templateCache.get('components/tooltip/templ/empty.hbs.html');
                    }

                    options.partials.element = templ;
                },

                onconstruct: function (options) {
                    if (options.partials) {
                        this.setTemplate(options)
                    }
                }
            });

            return TooltipBase;
        }]);

