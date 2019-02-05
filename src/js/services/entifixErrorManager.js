(function(){
    'use strict';

    angular
        .module('entifix-js')
        .service('EntifixErrorManager', service);

    service.$inject = ['EntifixSession', '$mdDialog', '$mdToast'];

    function service(EntifixSession, $mdDialog, $mdToast)
    {
        var vm = this;

        // Properties and Fields========================================================================================================================================================
        //==============================================================================================================================================================================
        
        
        //==============================================================================================================================================================================


        // Methods _____________________________________________________________________________________________________________________________________________________________________
        //==============================================================================================================================================================================

        // ERROR 401
        vm.unauthorizedError = function(error)
        {
            EntifixSession.refreshToken();
        };

        // ERROR 404
        vm.notFoundError = function(error)
        {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('¡Error 404! El recurso solicitado no fue encontrado.')
                    .position('bottom right')
                    .hideDelay(3000)
            );
        };
        
        // ERROR 500
        vm.internalServerError = function(error)
        {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('¡Error 500! El recurso solicitado presenta un error en el servidor.')
                    .position('bottom right')
                    .hideDelay(3000)
            );
        };
        
        //==============================================================================================================================================================================

    };
})();