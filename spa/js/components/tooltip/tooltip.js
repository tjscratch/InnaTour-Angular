/**
 *  Компонент ToolTip
 *
 *  @param tooltipKlass
 *  @param contentHtml
 *  @param condition
 *  @param position
 *  @param templ
 *  @param isVisible
 *  @param width
 *  @param close
 */
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
                    width: '',
                    tooltipKlass: '',
                    contentHTML: '',
                    condition: true,
                    isVisible: false,
                    position: "",
                    style: ''
                },

                /**
                 * Вычесляемые свойства
                 */
                computed: {
                    stylePosition: {
                        get: function () {
                            var style = '';
                            var pos = '';
                            var position = this.get('position').split('_')
                            var W = this.get('width');
                            var H = this.get('height');


                            position.forEach(function (itemPos) {
                                switch (itemPos) {
                                    case 'right':
                                        pos += itemPos + ":-" + W + "px;";
                                        break;
                                    case 'left':
                                        pos += ''
                                        break;
                                    case 'top':
                                        pos += ''
                                        break;
                                    case 'bottom':
                                        pos += ''
                                        break;
                                }
                            })


                            style = "width:" + this.get('width') + "px;" + pos;

                            return style;
                        },
                        set: function (params) {
                            this.set('width', params.width);
                        }
                    }
                },

                onrender: function () {
                    var that = this;

                    function bodyClickShareLink(evt) {
                        var $this = evt.target;

                        if ($this.classList) {
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
                    if (!this.get('close')) {
                        EventManager.on('tooltip:hide', function (data) {
                            if (data._guid != that._guid) {
                                that.hide();
                            }
                        });
                    }

                    // по клику в любом месте кроме компонента
                    // прячем его
                    if (!this.get('close')) {
                        document.addEventListener('click', bodyClickShareLink, false);
                    }

                    this.observe('isVisible', function (newValue, oldValue) {
                        if (newValue) {
                            EventManager.fire('tooltip:hide', this);

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

                computedStyle: function () {
                    if (this.get('position')) {
                        var style = {
                            width: $(this.find('.tooltip')).width(),
                            height: $(this.find('.tooltip')).height()
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


/**
 * Директива tooltip
 */
innaAppDirectives.directive('tooltipDirectiveBase', [
    '$templateCache',
    '$timeout',
    'EventManager',
    '$filter',

    'TooltipBase',
    function ($templateCache, $timeout, EventManager, $filter, TooltipBase) {
        return {
            replace: true,
            template: '',
            scope: {
                tooltipKlass: '@',
                contentHtml: '@',
                condition: '&',
                position: '@',
                templ: '@',
                isVisible: '=',
                width: '@',
                close: '@'
            },
            link: function ($scope, $element, $attr) {

                var el = $element[0];
                var html = el.innerHTML.length ? el.innerHTML : $scope.contentHtml;
                el.innerHTML = '';

                var coords = utils.getCoords(el);


                var _tooltipBase = new TooltipBase({
                    el: document.body,
                    data: {
                        tooltipKlass: $scope.tooltipKlass,
                        contentHTML: html,
                        condition: $scope.condition,
                        position: $scope.position,
                        coords: coords,
                        template: $scope.templ || '',
                        isVisible: $scope.isVisible || false,
                        width: $scope.width,
                        close: $scope.close
                    }
                });


                $scope.$watch('isVisible', function (value) {
                    _tooltipBase.set('isVisible', value);
                })


                $scope.$on('$destroy', function () {
                    _tooltipBase.teardown();
                    _tooltipBase = null;
                })
            }
        }
    }])

