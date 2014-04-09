innaAppControllers.
    controller('DynamicPackageMordaCtrl', [
        '$scope', 'DynamicFormSubmitListener',
        function ($scope, DynamicFormSubmitListener) {
            /*EventListeners*/
            DynamicFormSubmitListener.listen();


        }
    ]);