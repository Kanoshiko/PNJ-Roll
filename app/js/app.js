'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'myApp.runs']).
        config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/combat', {templateUrl: 'partials/combat.html', controller: 'CtrCombat'});
        $routeProvider.otherwise({redirectTo: '/combat'});
    }]);
