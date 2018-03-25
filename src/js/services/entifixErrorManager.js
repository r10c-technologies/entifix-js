(function(){
    'use strict';

    angular
        .module('entifix-js')
        .service('EntifixErrorManager', service);

    service.$inject = ['EntifixSession', '$window', 'AppRedirects', '$mdDialog', '$mdToast'];

    function service(EntifixSession, $window, AppRedirects, $mdDialog, $mdToast)
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
            if (!EntifixSession.devMode.get())
            {
                EntifixSession.redirect.set(EntifixSession.thisApplication.get());
                EntifixSession.authApp.set(EntifixSession.authUrl.get());
                $window.location.href = EntifixSession.authApplication.get();
            }
            else
                console.warn("DevMode: No auth application registered");
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

        //ERROR 412 
        vm.preconditionFailedError = function(error)
        {
            $mdDialog.show({    templateUrl: 'src/shared/components/entifixPreconditionFailedError/entifixPreconditionFailedError.html',
                                controller: 'PreconditionFailedErrorController',
                                parent: angular.element(document.body), clickOutsideToClose: false, escapeToClose: false, fullscreen: true,
                                controllerAs: 'vm',
                                locals: { sessionData: { subject: EntifixSession.currentUser.get(), authTokenName: EntifixSession.authTokenName.get(), currentWorkgroup: EntifixSession.currentWorkgroup.get() } }
                            })
            .then(function (){ }, function (){ });
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