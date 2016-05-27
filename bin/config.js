var config = {
    "dist": {
        "src": "./dist"
    },
    "nodeApp": {
        "distLayouts": "./dist/node-app/templates/layouts/*.hbs"
    },
    "images": {
        "src": "./spa/img/**",
        "distSrc": "./dist/spa/img"
    },
    "styles": {
        "src": "",
        "distSrc": "./dist/spa/css",
        "distSrcMd5": "./dist/spa/css/*.css"
    },
    "templates": {
        "src": [
            "./spa/templates/**/*.html",
            "./spa/js/**/*.html",
            "./spa/js/widgets/search/templ/*.html"
        ],
        "angularModuleName": "innaApp.templates",
        "distSrc": "./build/js",
        "distSrcMd5": "./build/js/*.js"
    },
    "js": {
        "src": "",
        "distSrc": "./build/js",
        "distSrcMd5": "./build/js/*.js",
        "bowerSrcs": [
            "./bower_components/underscore/underscore-min.js",
            "./bower_components/raven-js/dist/raven.min.js",
            "./bower_components/jquery/dist/jquery.min.js",
            "./bower_components/ractive/ractive.min.js",
            "./bower_components/ractive-events-hover/ractive-events-hover.js",
            "./bower_components/angular/angular.min.js",
            "./bower_components/angular-cookies/angular-cookies.min.js",
            "./bower_components/angular-locale-ru/angular-locale_ru.js",
            "./bower_components/angular-sanitize/angular-sanitize.min.js",
            "./bower_components/angular-route/angular-route.min.js",
            "./bower_components/angular-touch/angular-touch.min.js",
            "./bower_components/angular-hotkeys/build/hotkeys.min.js",
            "./bower_components/moment/min/moment.min.js",
            "./bower_components/moment/locale/ru.js",
            "./bower_components/angular-ui-scroll/dist/ui-scroll.min.js",
            "./bower_components/angular-validation/dist/angular-validation.min.js",
            "./bower_components/angular-validation/dist/angular-validation-rule.min.js",
            "./bower_components/angular-ui-select/dist/select.min.js",
            "./spa/lib/moment-ru.js",
            "./spa/lib/polyfill/**/*.js",
            "./spa/lib/jquery.maskedinput.js",
            "./spa/lib/jquery.ui.datepicker-ru.js",
            "./spa/lib/jquery.scrollTo.min.js",
            "./spa/lib/datepicker/datepicker.js",
            "./spa/lib/jquery-ui/jquery-ui.1.11.2.min.js",
            "./spa/lib/ui-bootstrap-typeahead-custom/typeahead.js",
            "./spa/lib/bootstrap-datepicker/bootstrap-datepicker.js",
            "./spa/lib/bootstrap-datepicker/bootstrap-datepicker.ru.min.js"
        ]
    },
}

module.exports = config;