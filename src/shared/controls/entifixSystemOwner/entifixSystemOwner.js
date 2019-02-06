(function () {
    'use strict';
   
    angular.module('entifix-js').controller('EntifixSystemOwnerController', controller);

    controller.$inject = ['EntifixSession', 'EntifixResource', 'EntifixConfig', '$mdDialog', 'EntifixNotification', '$state'];

    function controller(EntifixSession, EntifixResource, EntifixConfig, $mdDialog, EntifixNotification, $state)
    {
        var vm = this;

        // Properties & fields
        // ==============================================================================================================================================================

        // ==============================================================================================================================================================



        // Methods
        // ==============================================================================================================================================================
        function activate()
        {
            setDefaults();
            createComponents();
        };

        function createComponents()
        {
            vm.systemOwnerQueryDetails =
            {
                resource: vm.resource
            };

            vm.systemOwnerComponentConstruction =
            {
                title: { text: EntifixConfig.systemOwnerDisplayName.get() },
                displayPropertyName: 'systemOwner'
            };
        }

        function setDefaults()
        {
            vm.resource = new EntifixResource(EntifixConfig.systemOwnerEntityName.get());
        }

        vm.cancel = function()
        {
            $mdDialog.cancel();
        };

        vm.ok = function()
        {
            if (vm.systemOwner) {
                new EntifixResource(EntifixConfig.systemOwnerEntitySwapName.get()).saveEntity(
                    { [EntifixConfig.idSystemOwnerPropertyName.get()] : vm.systemOwner },
                    (response, saveSuccess) => {
                        if (saveSuccess) {
                            EntifixSession.saveTokens(response.data.data[EntifixConfig.authTokenName.get()], response.data.data[EntifixConfig.refreshTokenName.get()]);
                            EntifixNotification.success({"body": "La actualización de " + EntifixConfig.systemOwnerDisplayName.get() + " ha sido exitosa.", "isToast": true });
                            $state.reload();
                            $mdDialog.hide(vm.systemOwner);
                        } else {
                            EntifixNotification.error({"body": "Ocurrió un error durante la actualización de " + EntifixConfig.systemOwnerDisplayName.get() + ". Por favor vuelva a intentarlo.", "isToast": true });
                        }
                    },
                    error => {
                        EntifixNotification.error({"body": "Ocurrió un error durante la actualización de " + EntifixConfig.systemOwnerDisplayName.get() + ". Por favor vuelva a intentarlo. " + error.data.message, "isToast": true });
                    });
            } else {
                EntifixNotification.error({"body": "Por favor, seleccione un " + EntifixConfig.systemOwnerDisplayName.get() + ".", "isToast": true });
            }
        };

        activate();
        // ==============================================================================================================================================================
    };

    // FACTORY ================================================================================================================================================================================
    // ========================================================================================================================================================================================
    // =========================================================================================================================================================================================
    angular.module('entifix-js').factory('EntifixSystemOwner', systemOwnerFactory);
    
    systemOwnerFactory.$inject = ['$mdDialog'];

    function systemOwnerFactory($mdDialog)
    {
        var systemOwnerController = function()
        {
            var vm = this;

            // Properties and Fields _______________________________________________________________________________________________________________________________________________________            
            //==============================================================================================================================================================================

            //Fields ===>>>>:


            //Properties ===>>>>:
            
            
            //==============================================================================================================================================================================

            // Methods _____________________________________________________________________________________________________________________________________________________________________
            //==============================================================================================================================================================================
            vm.chooseSystemOwner = function (callback) 
            {
                $mdDialog.show({
                                    //templateUrl: 'src/shared/controls/entifixSystemOwner/entifixSystemOwner.html',
                                    template: '<md-dialog aria-label="Elija una clínica médica" class="md-md"> \
                                                    <md-toolbar md-colors="{background:\'default-primary-500\'}"> \
                                                        <div class="md-toolbar-tools" layout> \
                                                            <div flex layout layout-align="start center"> \
                                                                <div class="md-icon-button"><md-icon class="material-icons">warning</md-icon></div> \
                                                                <h2>&nbsp Elija una Clínica Médica</h2> \
                                                            </div> \
                                                        </div> \
                                                    </md-toolbar> \
                                                    <div> \
                                                        <md-dialog-content> \
                                                            <md-content layout-padding> \
                                                                <div flex> \
                                                                    <entifix-select \
                                                                        value-model="vm.systemOwner" \
                                                                        show-editable-fields="true" \
                                                                        query-details="vm.systemOwnerQueryDetails" \
                                                                        component-construction="vm.systemOwnerComponentConstruction" \
                                                                        component-binding-out="vm.systemOwnerInstance"> \
                                                                    </entifix-select> \
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
                                    controller: 'EntifixSystemOwnerController',
                                    parent: angular.element(document.body),
                                    clickOutsideToClose: false,
                                    escapeToClose: false,
                                    fullscreen: true,
                                    controllerAs: 'vm'
                                    })
                .then(function (results) { if(callback) callback(results); }, function () { });
            };

            //==============================================================================================================================================================================

        };

        return systemOwnerController;
    };

})();