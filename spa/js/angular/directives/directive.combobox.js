﻿
'use strict';

/* Directives */

innaAppDirectives.directive('combobox', ['$timeout', function ($timeout) {
    return {
        link: function ($scope, $element, attrs) {
            $scope.$on('comboboxDataLoaded', function () {
                $timeout(function () {
                    var $list = $element.find('.combo-box-list');
                    $list.css('display', 'block !important');


//                    console.log($list.show().width());
//                    $list.hide();

                }, 0, false);
            });
        }
    };
}]);