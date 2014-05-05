innaAppControllers
    .controller('DynamicPackageSERPFilterIndicatorCtrl', [
        '$scope', 'innaApp.API.events',
        function ($scope, Events) {
            $scope.filters = {}
            $scope.type = '';

            $scope.$on(Events.DYNAMIC_SERP_FILTER_ANY_CHANGE, function(event, data){
                $scope.type = data.type;
                for(var filter in data.filters) if(data.filters.hasOwnProperty(filter)) {
                    if(data.filters[filter].getIndicators) {
                        console.log('has getIndicators');
                        var indicators = data.filters[filter].getIndicators();
                        console.log(indicators);
                    } else {
                        console.log("doesn't have getIndicators", filter, data.filters[filter]);
                        $scope.filters[filter] = data.filters[filter];
                    }
                }
            });

            $scope.dropFilter = function(filterName){
                $scope.$emit(Events.DYNAMIC_SERP_FILTER_ANY_DROP, {type: $scope.type, filter: filterName});
            }

            $scope.translate = function(filterName, filterValue){
                var filterNameTranslated = filterName;

                switch(filterName) {
                    case 'Price': filterNameTranslated = 'Не дороже %s рублей'; break;
                }


                return filterNameTranslated.split('%s').join(filterValue);
            }
        }
    ]);