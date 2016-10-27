angular.module("innaSearchForm", [
    "ngSanitize",
    "ui.bootstrap",
    "innaApp.directives",
    "innaApp.templates",
    "widgetsInnaValidation",
    "widgetsInnaFilters",
    "widgetsInnaWidgetServices",
]);


var innaTemplates = angular.module('innaApp.templates', []);
var innaAppDirectives = angular.module('innaApp.directives', []);
var innaAppFilters = angular.module('widgetsInnaFilters', []);
var innaWidgetValidation = angular.module('widgetsInnaValidation', []);
var innaWidgetServices = angular.module('widgetsInnaWidgetServices', []);