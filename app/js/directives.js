'use strict';

/* Directives */


angular.module('myApp.directives', ['$strap.directives']).
        directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }]);
