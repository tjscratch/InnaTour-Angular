/**
 * Компонент DynamicBlock
 * Настраиваемый визуальный блок для вывода карточки отеля и авиа билета
 * принемает параметры
 * влияют на его визуальное отображение
 *
 * @param {Object} settings ->
 *
 * @param {Number} height
 * @param {Number} countColumn
 * @param {String} classBlock
 * @param {String} classColl3
 *
 * Метод setClass - устанавливает класс на основной div блока
 *
 * от этого компонента наследуются Hotels Ticket и Bundle
 *
 * Имеет дочерние компоненты поумолчанию
 *
 * components: {
 *     Stars: Stars,
 *     Tripadvisor: Tripadvisor,
 *     PriceGeneric: PriceGeneric
 * }
 *
 * Так же можно передать шаблоны колонок блока
 * collOneContent
 * collTwoContent
 * collThreeContent
 *
 * И задать любые partials
 */


angular.module('innaApp.components')
    .directive('dynamicBlock', [
        'EventManager',
        'innaApp.API.events',
        '$templateCache',
        '$filter',
        '$location',
        function (EventManager, Events, $templateCache, $filter, $location) {
            return {
                template: $templateCache.get('components/dynamic-block/templ/base.html'),
                replace: true,
                scope: {
                    recommendedPair: "=",
                    recommendedPairStatus: "=",
                    settings: "=",
                    partials: "=",
                    moreInfo: "=",
                    tripadvisor: "="
                },
                link: function ($scope, $element, $attr) {

                    $scope.hidden = false;
                    $scope.type = 'hotel';
                    $scope.isFullWL = (window.partners && window.partners.isFullWL());

                    $scope.model = {};
                    $scope.styleProfit = {
                        "margin-top": ($scope.recommendedPair.getProfit() <= 1000) ? 50 : 0
                    }

                    var settingsBlock = {
                        height: 220,
                        countColumn: 3,
                        classBlock: false,
                        classColl3: ''
                    }
                    $scope.settingsBlock = angular.extend(settingsBlock, $scope.settings);


                    var partialsTemplPath = {
                        collOneContent : "",
                        collTwoContent : "",
                        collThreeContent : "",
                        ruble : 'components/ruble.html'
                    }
                    var partTemplExtend = angular.extend(partialsTemplPath, $scope.partials);


                    $scope.partTempl = {};
                    $scope.partTempl['ruble'] = 'components/ruble.html';
                    $scope.partTempl['collOneContent'] = getPartials(partTemplExtend.collOneContent);
                    $scope.partTempl['collTwoContent'] = getPartials(partTemplExtend.collTwoContent);
                    $scope.partTempl['collThreeContent'] = getPartials(partTemplExtend.collThreeContent);

                    function getPartials(partName) {
                        var temp = '';
                        if (partName) {
                            temp = 'components/dynamic-block/templ/' + partName + '.html';
                        }
                        return temp;
                    }


                    $scope.bundleTicketDetails = function (evt) {
                        evt.stopPropagation();
                        var ticket = $scope.recommendedPair.ticket;
                        $scope.$emit(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED,
                            {ticket: ticket, noChoose: $location.search().displayHotel}
                        );
                    };

                    $scope.$watch('recommendedPair', function (value) {
                        if (value) {
                            $scope.AviaInfo = value.ticket ? value.ticket.data : null;
                            $scope.hotel = value.hotel ? value.hotel.data : null;
                        }
                    }, true);

                    $scope.$on('$destroy', function () {
                        console.log('$destroy dynamicBlock');
                        $scope.model = null;
                        $scope.partials = null;
                    });
                }
            }
        }]);