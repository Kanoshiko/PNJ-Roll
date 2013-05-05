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

        $http.get('data/pjs.json').success(function(data) {
            $rootScope.pjs = data;
        });

        $http.get('data/pnjs.json').success(function(data) {
            $rootScope.pnjs = data;

            var pnj;
            for (var i in $rootScope.pnjs) {

                pnj = $rootScope.pnjs[i];

                pnj.PV = pnj.anneaux.Terre * 19;
                pnj.malus = 0;
                pnj.etat = "Indemne";

                pnj.cible = undefined;
                pnj.attaqueToucher = 0;
                pnj.attaqueDegats = 0;

                pnj.calculBlessures = function(degats) {

                    if (degats > 0) {

                        this.PV = this.PV - Math.max((degats - this.DR), 0);

                        var tab =
                                [
                                    [this.anneaux.Terre * 5, 0, "Indemne"],
                                    [this.anneaux.Terre * 7, -3, "Egratigné"],
                                    [this.anneaux.Terre * 9, -5, "Légèrement blessé"],
                                    [this.anneaux.Terre * 11, -10, "Blessé"],
                                    [this.anneaux.Terre * 13, -15, "Gravement blessé"],
                                    [this.anneaux.Terre * 15, -20, "Impotent"],
                                    [this.anneaux.Terre * 17, -40, "Epuisé"],
                                    [this.anneaux.Terre * 19, -1000, "Hors de combat"],
                                    [1000, -1000, "Mort"]
                                ];


                        for (var j in tab) {
                            console.log(pnj.anneaux.Terre * 19 - this.PV, tab[j][0]);
                            if ((this.anneaux.Terre * 19 - this.PV) < tab[j][0]) {

                                this.malus = tab[j][1];
                                this.etat = tab[j][2];
                                break;
                            }
                        }
                    }
                };

                pnj.attaquer = function() {
                    this.attaqueToucher = $rootScope.diceRoll(this.attaque.toucher[0], this.attaque.toucher[1], this.attaque.spe, pnj.malus);
                    this.attaqueDegats = $rootScope.diceRoll(this.attaque.degats[0], this.attaque.degats[1], false, 0);
                };

                pnj.lancerInit = function() {
                    this.initJet = $rootScope.diceRoll(this.init[0], this.init[1], false, 0);
                };

                pnj.calculerPV = function() {
                    this.PV = this.anneaux.Terre * 19;
                    this.malus = 0;
                    this.etat = "Indemne";
                };
            }

            console.debug($rootScope.pnjs);

        });

    }]);
