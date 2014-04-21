innaAppControllers
    .controller('DynamicPackageSERPFilterIndicatorCtrl', [
        '$scope', 'innaApp.API.events',
        function ($scope, Events) {
            $scope.filters = {}
            $scope.type = '';

            $scope.$on(Events.DYNAMIC_SERP_FILTER_ANY_CHANGE, function(event, data){
                var preparators = {
                    Stars: function(value, object){
                        if(value == 'all') delete object.Stars;
                    },
                    Legs: function(value, object){
                        for(var p in value) if(value.hasOwnProperty(p)) value[p] = true;
                    }
                }

                $scope.type = data.type;

                var filters = data.filters;
                for(var filter in filters) if(filters.hasOwnProperty(filter)) {
                    if(filter in preparators) {
                        preparators[filter](filters[filter], filters);
                    }
                }
                filters = _.dropEmptyKeys(_.flattenObject(data.filters));

                $scope.filters = filters;
            });

            $scope.dropFilter = function(filterName){
                $scope.$emit(Events.DYNAMIC_SERP_FILTER_ANY_DROP, {type: $scope.type, filter: filterName});
            }
        }
    ]);