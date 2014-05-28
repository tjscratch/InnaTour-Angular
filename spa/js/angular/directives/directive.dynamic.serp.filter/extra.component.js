angular.module('innaApp.directives')
    .directive('dynamicSerpFilterExtra', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/dynamic-serp-filter/extra.html'),
            scope: {
                'hotels': '=dynamicSerpFilterExtraHotels',
                'filters': '=dynamicSerpFilterExtraFilters'
            },
            controller: [
                '$scope', '$controller', '$element',
                function($scope, $controller, $element){
                    /*Mixins*/
                    $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                    /*Models*/
                    var Options = inna.Models.Avia.Filters._OptionsFactory();
                    var Option = inna.Models.Avia.Filters._OptionFactory(function(title, value, minPrice){
                        this.minPrice = minPrice;
                        this.value = value;

                        this.shown = true;
                    });

                    Option.prototype.describe = function(){
                        return this.title;
                    }

                    /*Properties*/
                    $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter());
                    $scope.filter.filterFn = function(hotel){
                        var fits = true;

                        this.options.getSelected().each(function(option){
                            fits = fits && (option.value in hotel.data.Extra);
                        });

                        if(!fits) hotel.hidden = true;
                    };
                    $scope.options = $scope.filter.options = new Options();

                    /*Watchers*/
                    var unwatchCollectionHotels = $scope.$watchCollection('hotels', function(hotels){
                        if(!hotels || !hotels.list.length) return;

                        var collections = {};

                        hotels.each(function(hotel){
                            if(!hotel.data.Extra) return;

                            for(var extra in hotel.data.Extra) if(hotel.data.Extra.hasOwnProperty(extra)) {
                                var name = hotel.data.Extra[extra];
                                (
                                    collections[extra] || (
                                        collections[extra] = {name: name, collection: new inna.Models.Hotels.HotelsCollection()}
                                    )
                                ).collection.push(hotel);
                            }
                        });

                        for(var name in collections) if(collections.hasOwnProperty(name)) {
                            $scope.options.push(new Option(collections[name].name, name, collections[name].collection.getMinPrice()));
                        };

                        unwatchCollectionHotels();
                    });
                }
            ]
        }
    }]);