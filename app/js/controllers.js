'use strict';
/* Controllers */

angular.module('myApp.controllers', []).
        controller('CtrCombat', ['$rootScope', '$scope', function($rootScope, $scope) {
        $scope.triParInit = function(pnj) {
            return -Number(pnj.initJet);
        };

        $scope.lancerInits = function() {
            for (var i in $rootScope.pnjs) {
                $rootScope.pnjs[i].lancerInit();
            }
        };
    }
]);
