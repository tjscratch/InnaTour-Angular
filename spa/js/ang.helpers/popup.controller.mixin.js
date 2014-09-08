angular.module('innaApp.controllers')
    .controller('PopupCtrlMixin', [
        '$scope', '$element',
        function($scope, $element) {
            $scope.popup = {
                isOpen: false,
                toggle: function(){
                    $scope.popup.isOpen = !$scope.popup.isOpen;
                }
            }

            var doc = $(document);
            var onClick = function(event) {
                var isInsideComponent = $.contains($($element)[0], event.target);

                if(!isInsideComponent) {
                    $scope.$apply(function($scope){
                        $scope.popup.isOpen = false;
                    });
                }
            }

            doc.on('click', onClick);

            $scope.$on('$destroy', function(){
                doc.off('click', onClick);
            });
        }
    ])