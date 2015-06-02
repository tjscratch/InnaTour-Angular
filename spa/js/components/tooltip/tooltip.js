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
                    positionStyle: '',
                    coords: null,
                    close: false,
                    width: '',
                    tooltipKlass: '',
                    contentHTML: '',
                    condition: true,
                    isVisible: false,
                    position: "",
                    style: ''
                },

                computed : {
                    tooltipKlassComputed : function(){
                        var splitKlass = this.get('tooltipKlass').split(':');
                        var klass = '';
                        var prifex = 'b-tooltip';

                        for (var i = 0; i < splitKlass.length; i++) {
                            var str = splitKlass[i];
                            klass += prifex+"_"+str+" ";
                        }

                        return klass;
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
                    }

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
                    },

                    ruble: $templateCache.get('components/ruble.html')
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
            transclude: false,
            template: '',
            scope: {
                propertyWatch : '=',
                tooltipKlass: '@',
                contentHtml: '@',
                condition: '&',
                position: '@',
                positionStyle : '@',
                templ: '@',
                pin: '@',
                isVisible: '=',
                width: '@',
                close: '@',
                el: '@',
                coords: "="
            },
            link: function ($scope, $element, $attr) {


                var el = $element[0];
                var html = el.innerHTML.length ? el.innerHTML : $scope.contentHtml;

                if(!$scope.propertyWatch) {
                    el.innerHTML = '';
                }
                var coords = utils.getCoords(el);

                if($scope.coords){
                    coords = $scope.coords;
                }
                
                var _tooltipBase = new TooltipBase({
                    el: ($scope.el) ? $element[0] : document.body,
                    data: {
                        tooltipKlass: $scope.tooltipKlass,
                        contentHTML: html,
                        condition: $scope.condition,
                        position: $scope.position,
                        positionStyle: $scope.positionStyle,
                        coords: coords,
                        pin : $scope.pin,
                        template: $scope.templ || '',
                        isVisible: $scope.isVisible || false,
                        width: $scope.width,
                        close: $scope.close
                    }
                });

                $scope.$watch('propertyWatch', function(value){
                    if(value) {
                        _tooltipBase.set('NewPricePackage', value);
                    }
                });

                $scope.$watch('isVisible', function (value) {
                    _tooltipBase.set('isVisible', value);
                });


                $scope.$on('$destroy', function () {
                    _tooltipBase.teardown();
                    _tooltipBase = null;
                })
            }
        }
    }]);

