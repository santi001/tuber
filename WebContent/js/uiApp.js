    var app = angular.module("ngMap", ["ng-fusioncharts"]);
    app.controller(
        "tuberApp", [
            '$scope', '$http', '$timeout',
            function($scope, $http, $timeout) {
                $scope.user = { "name": "ShummyLyn", "admin": true };
                $scope.newContainer = { "containerId": null, "percentageFull": 0, "lng": null, "lat": null, "address": null };

                $scope.addContainer = function(jsonContainer) {
                    $scope.addressError = null;
                    console.log("Inside addContainer angular function");
                    console.log(jsonContainer);
                    $http({
                        method: 'POST',
                        url: '/api/container',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: jsonContainer
                    }).then(
                        function(response) {
                            console.log(response.data);
                            noty({
                                text: "Nuevo contenedor almacenado satisfactoriamente. ",
                                type: 'success',
                                timeout: 5000
                            });
                            $scope.newContainer = response.data;
                            $('#insertContainer').modal('hide');
                        },
                        function(response) {
                            $scope.addressError = 'Request failed' + " error code: " + response.data + response.data.status;
                        });
                };

                $scope.callFnOnInterval = function(fn, timeInterval) {
                    var timeIntervalInSec = 1;

                    var promise = $timeout(fn, timeInterval);

                    return promise.then(function() {
                        $scope.callFnOnInterval(fn, timeInterval);
                    });
                };

                $scope.getContainers = function() {
                    $http({
                        method: 'GET',
                        url: '/api/container',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }).then(
                        function(response) {
                            $scope.containers = response.data;
                        },
                        function(response) {
                            $scope.addressError = 'Request failed' + " error code: " + response.data + response.data.status;
                        });
                };

                $scope.callFnOnInterval($scope.getContainers, 20000);

                $scope.prepareToDelete = function(container) {
                    $scope.deleteContainer = container;
                };

                $scope.delete = function() {
                    $http({
                        method: 'DELETE',
                        url: '/api/delete',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: $scope.deleteContainer
                    }).then(
                        function(response) {
                            console.log(response.data);
                            noty({
                                text: "Contenedor eliminado satisfactoriamente. ",
                                type: 'success',
                                timeout: 5000
                            });
                            $('#viewContainers').modal('hide');
                            $('#editContainer').modal('hide');
                        },
                        function(response) {
                            $scope.addressError = 'Request failed' + " error code: " + response.data + response.data.status;
                        });
                };

                $scope.clearPercentage = function() {

                    noty({
                        text: 'Se vaciarán los contenedores llenos, confirme para continuar',
                        theme: 'defaultTheme',
                        layout: 'center',
                        type: 'confirm',
                        buttons: [{
                            addClass: 'button',
                            text: 'Continuar',
                            onClick: function($noty) {
                                $noty.close();

                                var llenado = document.getElementById('llenado-minimo').value;
                                var json = { "llenado": llenado };
                                $http({
                                    method: 'PUT',
                                    url: '/api/clear',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    data: json
                                }).then(
                                    function(response) {
                                        console.log(response.data);
                                        noty({
                                            text: "Los contenedores con porcentaje llenado mayor a " + llenado + " fueron vaciados correctamente.",
                                            type: 'success',
                                            timeout: 5000
                                        });
                                    },
                                    function(response) {
                                        $scope.addressError = 'Request failed' + " error code: " + response.data + response.data.status;
                                    });

                            }
                        }, {
                            addClass: 'button',
                            text: 'Cancel',
                            onClick: function($noty) {
                                $noty.close();
                            }
                        }]
                    });
                };

                $scope.login = function() {
                    if ($scope.user.username && $scope.user.password) {
                        $http({
                            method: 'POST',
                            url: '/api/login',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: $scope.user
                        }).then(
                            function(response) {
                                console.log('Logueado exitosamente ', response);
                                $scope.badLogin = {};
                                $scope.user = response.data;
                                $('#login').modal('hide');
                                $('#logueo').modal('hide');
                                noty({
                                    text: "Logueado exitosamente " + $scope.user.username,
                                    type: 'success',
                                    timeout: 5000
                                });
                            },
                            function(response) {
                                console.log('Error intentando iniciar sesión', response);
                                $scope.badLogin = response.data;
                            });
                    }
                };

                // SIGN UP METHOD
                $scope.signup = function() {
                    if ($scope.newuser.username && $scope.newuser.password && $scope.newuser.firstName && $scope.newuser.lastName) {
                        $http({
                            method: 'POST',
                            url: '/api/user',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: $scope.newuser
                        }).then(
                            function(response) {
                                $scope.newuser = response.data.user;
                                $scope.duplicatedUser = {};
                                $('#signup').modal('hide');
                                noty({
                                    text: "Te registraste exitosamente " + $scope.newuser.username,
                                    type: 'success',
                                    timeout: 5000
                                });
                            },
                            function(response) {
                                $scope.duplicatedUser = response.data;
                            });
                    }
                };

                $scope.dataSource = {};
                $scope.estadistica = function() {
                    var log = [];
                    angular.forEach($scope.containers, function(value, index) {
                        var myObj = {
                            label: value.containerId, //your artist variable
                            value: "" + value.timesCleared + "" //your title variable
                        };
                        this.push(myObj);
                    }, log);

                    // chart data source
                    $scope.dataSource = {
                        chart: {
                            caption: "Estadísticas de los contenedores",
                            captionFontSize: "24",
                            // more chart properties - explained later
                        },
                        data: log
                    };
                }

            }
        ]);
