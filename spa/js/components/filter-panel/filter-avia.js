/**
 * Панель фильтрации для отелей и билетов
 *
 * При выборе любого свойства на панели,
 * фильтруем, сортируем и диспачим событие с этим набором
 *
 * EventManager.fire('FilterPanel:change', filtersCollection)
 * Логику фильтрации реализует сама панель и сервис FilterService
 */

angular.module('innaApp.directives')
    .directive('filterPanelAvia', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaAppApiEvents',
        '$timeout',

        'FilterPanel',

        'FilterTime',
        'FilterAirline',
        'FilterAirPort',
        'FilterAviaLegs',
        'FilterPrice',
        function (EventManager, $filter, $templateCache, $routeParams, Events, $timeout, FilterPanel, FilterTime, FilterAirline, FilterAirPort, FilterAviaLegs, FilterPrice) {

            return {
                scope: {
                    filtersSettings: '=filtersSettings',
                    activePanel: '=activePanel',
                    typePanel: '@typePanel'
                },
                link: function ($scope, $element, attrs) {


                  /**
                   * Компонент FilterPanelAvia
                   * @class
                   * @inherits FilterPanel
                   */
                    var FilterPanelAvia = FilterPanel.extend({
                        el : $element,
                        data : {
                            filtersCollection: []
                        },
                        components : {
                            'FilterPrice': FilterPrice,
                            'FilterTime': FilterTime,
                            'FilterAirline': FilterAirline,
                            'FilterAirPort': FilterAirPort,
                            'FilterAviaLegs': FilterAviaLegs
                        }
                    });

                    /*----------------- INIT ---------------------*/
                    /*--------------------------------------------*/
                    /*--------------------------------------------*/
                    var FilterPanelComponent = null;

                    /**
                     * Слушаем изменения объекта filtersSettings
                     */
                    $scope.$watch('filtersSettings', function (value) {
                        if (value) {
                            $scope.activePanel = 'ticket';
                            value.type = 'ticket';
                            if (!FilterPanelComponent) {
                                FilterPanelComponent = new FilterPanelAvia({ data: value });
                            } else {
                                value.updateModel = Math.random(1000).toString(16);
                                FilterPanelComponent.set(value)
                            }
                        }
                    });


                    /* прячем панель */
                    $scope.$watch('activePanel', function (value) {
                        if (value) {
                            if (FilterPanelComponent && (FilterPanelComponent.get('type') != value)) {
                                FilterPanelComponent.fire('hide');
                            }
                        }
                    });

                    $scope.$on('$destroy', function () {
                        if (FilterPanelComponent) {
                            FilterPanelComponent.teardown();
                            FilterPanelAvia = null;
                            FilterPanelComponent = null;
                        }
                    })
                }
            };
        }]);
