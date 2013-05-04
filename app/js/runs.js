'use strict';


angular.module('myApp.runs', [])
        .run(['$rootScope', '$http', function($rootScope, $http) {

        $rootScope.diceRoll = function(DesLances, DesGardes, spe, malus) {
            var des = [];

            for (var i = 0; i < DesLances; i++) {

                var de = Math.round((10 * Math.random()) + 0.5);
                var totalDe = 0;

                if (de === 1 && spe === true) {
                    de = Math.round((10 * Math.random()) + 0.5);
                }

                if (de === 10) {
                    totalDe += 10;
                    de = Math.round((10 * Math.random()) + 0.5);

                    if (de === 10) {
                        totalDe += 10;
                        de = Math.round((10 * Math.random()) + 0.5);

                        if (de === 10) {
                            totalDe += 10;
                            de = Math.round((10 * Math.random()) + 0.5);
                        }
                    }
                }

                totalDe += de;

                des.push(totalDe);
            }

            des.sort(sortEntier).splice(0, DesLances - DesGardes);

            var total = 0;
            for (i in des) {
                total += des[i];
            }

            return total + malus;
        };

        var sortEntier = function(a, b) {
            return (Number(a) > Number(b));
        };



        $http.get('data/pnjs.json').success(function(data) {
            $rootScope.pnjs = data;

            var pnj;
            for (var i in $rootScope.pnjs) {

                pnj = $rootScope.pnjs[i];

                pnj.PV = pnj.anneaux.Terre * 19;
                pnj.malus = 0;
                pnj.etat = "Indemne";

                pnj.attaqueToucher = 0;
                pnj.attaqueDegats = 0;

                pnj.calculBlessures = function(degats) {

                    if (degats > 0) {

                        pnj.PV = pnj.PV - Math.max((degats - pnj.DR), 0);

                        var tab =
                                [
                                    [pnj.anneaux.Terre * 5, 0, "Indemne"],
                                    [pnj.anneaux.Terre * 7, -3, "Egratigné"],
                                    [pnj.anneaux.Terre * 9, -5, "Légèrement blessé"],
                                    [pnj.anneaux.Terre * 11, -10, "Blessé"],
                                    [pnj.anneaux.Terre * 13, -15, "Gravement blessé"],
                                    [pnj.anneaux.Terre * 15, -20, "Impotent"],
                                    [pnj.anneaux.Terre * 17, -40, "Epuisé"],
                                    [pnj.anneaux.Terre * 19, -1000, "Hors de combat"],
                                    [1000, -1000, "Mort"]
                                ];


                        for (var j in tab) {
                            console.log(pnj.anneaux.Terre * 19 - pnj.PV, tab[j][0]);
                            if ((pnj.anneaux.Terre * 19 - pnj.PV) < tab[j][0]) {

                                pnj.malus = tab[j][1];
                                pnj.etat = tab[j][2];
                                break;
                            }
                        }
                    }
                };

                pnj.attaquer = function() {
                    pnj.attaqueToucher = $rootScope.diceRoll(pnj.attaque.toucher[0], pnj.attaque.toucher[1], pnj.attaque.spe, pnj.malus);
                    pnj.attaqueDegats = $rootScope.diceRoll(pnj.attaque.degats[0], pnj.attaque.degats[1], false, 0);
                };

                pnj.lancerInit = function() {
                    pnj.initJet = $rootScope.diceRoll(pnj.init[0], pnj.init[1], false, 0);
                };

                pnj.calculerPV = function() {
                    pnj.PV = pnj.anneaux.Terre * 19;
                    pnj.malus = 0;
                    pnj.etat = "Indemne";
                };
            }

        });

    }]);
