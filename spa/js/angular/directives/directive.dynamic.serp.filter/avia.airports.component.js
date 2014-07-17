angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaAirports', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/dynamic-serp-filter/avia.airports.html'),
            scope: {
                tickets: '=innaDynamicSerpFilterAviaAirportsTickets',
                filters: '=innaDynamicSerpFilterAviaAirportsFilters'
            },
            controller: [
                '$scope', '$element', '$controller', 'innaApp.API.events',
                function($scope, $element, $controller, Events){
                    /*Mixins*/
                    $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                    /*Models*/
                    var Option = inna.Models.Avia.Filters._OptionFactory(function(title, code){
                        this.code = code;
                    });

                    Option.prototype.describe = function(){
                        return '# (%)'.
                            split('#').join(this.title).
                            split('%').join(this.code);
                    };

                    var Options = inna.Models.Avia.Filters._OptionsFactory();

                    Options.prototype.pushUnique = function(option){
                        var existing = this._searchByCode(option.code);

                        if(!existing) {
                            this.push(option);
                        }
                    };

                    Options.prototype._searchByCode = function(code){
                        for(var i = 0, option = null; option = this.options[i++];) {
                            if(option.code == code) return option;
                        }

                        return null;
                    };

                    /*Properties*/
                    $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('Airport'));
                    $scope.options = $scope.filter.options = new Options();
                    $scope.filter.filterFn = function(ticket){
                        //console.log('---------------------------');

                        var show = false;

                        this.options.getSelected().each(function(option){
                            ticket.everyEtap(function(etap){
                                //console.log(option.code, etap.data.InCode, etap.data.OutCode);

                                show = show || etap.data.InCode == option.code || etap.data.OutCode == option.code;
                            });

                            //console.log(show);
                        });

                        if(!show) {
                            ticket.hidden = true;
                        }
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

                        unwatchCollectionTickets();
                    })
                }
            ]
        }
    }]);