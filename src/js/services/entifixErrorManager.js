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
            $mdDialog.show({    template: '<md-dialog aria-label="Elija una Bodega para trabajar" class="md-md"> \
                                                <md-toolbar> \
                                                    <div class="md-toolbar-tools" md-colors="{color: \'default-primary-50\'}" layout> \
                                                        <div flex layout layout-align="start center"> \
                                                            <div class="md-icon-button"><md-icon class="material-icons">warning</md-icon></div> \
                                                            <h2>&nbsp Elija una Bodega para trabajar</h2> \
                                                        </div> \
                                                    </div> \
                                                </md-toolbar> \
                                                <div> \
                                                    <md-dialog-content> \
                                                        <md-content layout-padding> \
                                                            <div flex> \
                                                                <md-input-container class="entifix-select-width"> \
                                                                    <label>Bodega</label> \
                                                                    <md-select \
                                                                        ng-model="vm.workgroupName" \
                                                                        aria-label="Bodega"> \
                                                                        <md-option ng-repeat="item in vm.workgroups" ng-click="vm.setWorkgroupId(item)" ng-value="item.nombreBodega">{{item.nombreBodega}}</md-option> \
                                                                    </md-select> \
                                                                </md-input-container> \
                                                            </div> \
                                                        </md-content> \
                                                    </md-dialog-content> \
                                                    <md-dialog-actions layout="row"> \
                                                        <md-button md-colors="{background: \'default-primary-50\'}" ng-click="vm.cancel()"> \
                                                            <md-icon class="material-icons">clear</md-icon> Cancelar \
                                                        </md-button> \
                                                        <md-button md-colors="{background: \'default-primary-50\'}" ng-click="vm.ok()"> \
                                                            <md-icon class="material-icons">done</md-icon> Ok \
                                                        </md-button> \
                                                    </md-dialog-actions> \
                                                </div> \
                                            </md-dialog>',
                                //templateUrl: 'src/shared/components/entifixPreconditionFailedError/entifixPreconditionFailedError.html',
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