angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaAirports', function(){
        return {
            templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.airports.html',
            scope: {
                tickets: '=innaDynamicSerpFilterAviaAirportsTickets'
            },
            controller: [
                '$scope', '$element', '$controller', 'innaApp.API.events',
                function($scope, $element, $controller, Events){
                    /*Mixins*/
                    $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                    /*Models*/
                    function Option(name, code) {
                        this.name = name;
                        this.code = code;
                        this.selected = false;
                    }

                    function Options() {
                        this.options = [];
                    }

                    Options.prototype.pushUnique = function(option){
                        var existing = this._searchByCode(option.code);

                        if(!existing) {
                            this.options.push(option);
                        }
                    }

                    Options.prototype._searchByCode = function(code){
                        for(var i = 0, option = null; option = this.options[i++];) {
                            if(option.code == code) return option;
                        }

                        return null;
                    }

                    /*Properties*/
                    $scope.options = new Options();

                    /*Methods*/
                    $scope.onChange = function() {
                        $scope.$emit(Events.DYNAMIC_SERP_FILTER_TICKET, {filter: 'Airports', value: $scope.options});
                    };

                    $scope.reset = function(){
                        for(var i = 0, option = null; option = $scope.options.options[i++];) {
                            option.selected = false;
                        }

                        $scope.onChange();
                    }

                    /*Watchers*/
                    var unwatchCollectionTickets = $scope.$watchCollection('tickets', function(tickets){
                        if(!tickets || !tickets.list.length) return;

                        tickets.each(function(ticket){
                            for(var i = 0, dir = '', etaps = null; (dir = ['To', 'Back'][i++]) && (etaps = ticket.getEtaps(dir));){
                                for(var j = 0, etap = null; etap = etaps[j++];) {
                                    $scope.options.pushUnique(new Option(etap.data.InPort, etap.data.InCode));
                                    $scope.options.pushUnique(new Option(etap.data.OutPort, etap.data.OutCode));
                                }
                            }
                        });

                        console.log($scope.options);

                        unwatchCollectionTickets();
                    })
                }
            ]
        }
    });