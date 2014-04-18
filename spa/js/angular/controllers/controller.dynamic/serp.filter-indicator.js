innaAppControllers
    .controller('DynamicPackageSERPFilterIndicatorCtrl', [
        '$scope', 'innaApp.API.events',
        function ($scope, Events) {
            $scope.filters = {}
            $scope.type = '';

            $scope.$on(Events.DYNAMIC_SERP_FILTER_ANY_CHANGE, function(event, data){
                $scope.type = data.type;

                var filters = _.dropEmptyKeys(_.flattenObject(data.filters));

                if(filters.Stars == 'all') delete filters.Stars;

                $scope.filters = filters;
            });

            $scope.dropFilter = function(filterName){
                $scope.$emit(Events.DYNAMIC_SERP_FILTER_ANY_DROP, {type: $scope.type, filter: filterName});
            }
        }
    ]);