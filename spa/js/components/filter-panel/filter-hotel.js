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
    .directive('filterPanelHotel', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',
        '$timeout',

        'FilterPanel',

        'FilterExtra',
        'FilterPrice',
        'FilterName',
        'FilterStars',
        'FilterTaFactor',
        'FilterType',
        function (EventManager, $filter, $templateCache, $routeParams, Events, $timeout, FilterPanel, FilterExtra, FilterPrice, FilterName, FilterStars, FilterTaFactor, FilterType) {

            return {
                scope: {
                    filtersSettings: '=filtersSettings',
                    activePanel: '=activePanel',
                    typePanel: '@typePanel'
                },
                link: function ($scope, $element, attrs) {

                    var FilterPanelHotel = FilterPanel.extend({
                        el : $element,
                        data : {
                            filtersCollection: []
                        },
                        components: {
                            'FilterExtra': FilterExtra,
                            'FilterPrice': FilterPrice,
                            'FilterName': FilterName,
                            'FilterStars': FilterStars,
                            'FilterTaFactor': FilterTaFactor,
                            'FilterType': FilterType
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
                            $scope.activePanel = 'hotels';
                            value.type = 'hotels';
                            if (!FilterPanelComponent) {
                                FilterPanelComponent = new FilterPanelHotel({ data: value });
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
                        FilterPanelComponent.teardown();
                        FilterPanelComponent = null;
                    })
                }
            };
        }]);
