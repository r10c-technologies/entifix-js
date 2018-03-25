(function () {
    'use strict';
   
    angular.module('entifix-js').controller('PreconditionFailedErrorController', controller);
    controller.$inject = ['sessionData', 'AppResources', '$http', '$mdDialog', '$state'];

    function controller(sessionData, AppResources, $http, $mdDialog, $state)
    {
        var vm = this;

        // Properties & fields
        // ==============================================================================================================================================================

        // ==============================================================================================================================================================



        // Methods
        // ==============================================================================================================================================================
        function activate()
        {
            createComponents();
            setDefaults();
        };

        function createComponents()
        {
            $http({
                method: 'GET',
                url: AppResources.baseUrl + AppResources.api + 'catalogo/bodega' + '?administradores.nip=' + sessionData.subject
            }).then((results)=> { if (results.data.data) vm.workgroups= results.data.data });
        }

        function setDefaults()
        {
            if (sessionData.currentWorkgroup)
                $http({ method: 'GET', url: AppResources.baseUrl + AppResources.api + 'catalogo/bodega' + '?id=' + sessionData.currentWorkgroup}).then((results)=> { if (results.data.data[0]) vm.workgroupName = results.data.data[0].nombreBodega });
        }

        vm.cancel = function()
        {
            $mdDialog.cancel();
        };

        vm.ok = function()
        {
            $http({
                    method: 'PUT',
                    url: AppResources.baseUrl + AppResources.api + AppResources.login,
                    data: { subject: sessionData.subject, workgroupId: vm.workgroupId }
                }).then(actionSuccess,actionError);
        };

        function actionSuccess(results)
        {
            localStorage.setItem(sessionData.authTokenName, results.data.data[0][sessionData.authTokenName]);
            $state.reload();
            $mdDialog.hide(vm.workgroupName);
        }

        function actionError()
        {
            swal('¡Error!', 'Ocurrió un error al intentar elegir una bodega. Por favor intentelo de nuevo o contacte a su administrador de Sistemas.', 'error');
        }

        vm.setWorkgroupId = function(workgroup)
        {
            if (workgroup)
                vm.workgroupId = workgroup.id;
        }

        activate();
        // ==============================================================================================================================================================
    };

})();