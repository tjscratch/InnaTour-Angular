angular.module('innaApp.controllers')
    .controller('AuthRegistrationCtrl', [
        '$scope', 'AuthDataProvider', 'Validators',
        function($scope, AuthDataProvider, Validators){
            function validate(){
                Validators.email($scope.email, 'email');
                //Validators.defined($scope.firstName, 'firstName');
                //Validators.defined($scope.lastName, 'lastName');
                //Validators.phone($scope.phone, 'phone');
                Validators.defined($scope.password, 'password');
                Validators.minLength($scope.password, 6, 'passwordMinLength')
                Validators.equals($scope.password, $scope.password2, 'password2');
            }

            function register(){
                AuthDataProvider.signUp({
                    Email: $scope.email,
                    //FirstName: $scope.firstName,
                    //LastName: $scope.lastName,
                    //Phone: $scope.phone,
                    Password: $scope.password,
                    ConfirmPassword: $scope.password2
                }, function (data){ //successfully signed up
                    $scope.showLanding = true;
                }, function (error){ //error has occurred
                    $scope.requestFailure = true;
                });
            }

            /*Properties*/
            $scope.email = '';

            $scope.$watch('email', function(){
                $scope.errors.email = false;
                $scope.requestFailure = false;
            });

//            $scope.firstName = '';
//
//            $scope.$watch('firstName', function(){
//                $scope.errors.firstName = false;
//            })
//
//            $scope.lastName = '';
//
//            $scope.$watch('lastName', function(){
//                $scope.errors.lastName = false;
//            });
//
//            $scope.phone = '';
//
//            $scope.$watch('phone', function(){
//                $scope.errors.phone = false;
//            })

            $scope.password = '';

            $scope.$watch('password', function(){
                $scope.errors.password = false;
                $scope.errors.passwordMinLength = false;
            });

            $scope.$watch('password2', function(){
                $scope.errors.password2 = false;
            });

            $scope.password2 = '';

            $scope.errors = {};

            $scope.showLanding = false;

            $scope.requestFailure = false;



            /*Methods*/
            $scope.register = function(){
                try {
                    validate();

                    //if ok
                    register();
                } catch(fieldName) {
                    console.log(fieldName);
                    $scope.errors[fieldName] = true;
                }
            }

            $scope.hasError = function(fieldName){
                var error = 'error';

                if($scope.errors[fieldName]) return error;

                if(fieldName == 'email' && $scope.requestFailure) return error;

                return '';
            }
        }
    ])