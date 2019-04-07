(function () {
    'use strict';
   
    angular.module('entifix-js').controller('EntifixDownloadReportSettingsController', controller);

    controller.$inject = ['$mdDialog', 'EntifixNotification'];

    function controller($mdDialog, EntifixNotification)
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
            vm.tableStripedComponentConstruction =
            {
                title: { text: 'Tabla Rayada' },
                isSwitch: true
            };

            vm.pageSizeComponentConstruction =
            {
                title: { text: 'Tamaño de la hoja' },
                collection: { elements: [{ Display: 'Letter', Value: 'Letter' }, { Display: 'Legal', Value: 'Legal' }, { Display: 'A0', Value: 'A0' }, { Display: 'A1', Value: 'A1' }, { Display: 'A2', Value: 'A2' }, { Display: 'A3', Value: 'A3' }, { Display: 'A4', Value: 'A4' }]}
            };

            vm.pageOrientationComponentConstruction =
            {
                title: { text: 'Orientación de la hoja' },
                collection: { elements: [{ Display: 'Landscape', Value: 'Landscape' }, { Display: 'Portrait', Value: 'Portrait' }]}
            };
        }

        function setDefaults()
        {
            vm.header = "Configuración del reporte";
            vm.entity = {};
            vm.entity.tableStriped = true;
            vm.entity.pageSize = "Letter";
            vm.entity.pageOrientation = "Landscape";
        }

        vm.cancel = function()
        {
            $mdDialog.cancel(vm.entity);
        };

        vm.ok = function()
        {
            if (vm.entity.tableStriped != undefined && vm.entity.pageSize != undefined && vm.entity.pageOrientation != undefined) {
                $mdDialog.hide(vm.entity);
            } else {
                EntifixNotification.error({"body": "Por favor, seleccione todas las opciones.", "isToast": true });
            }
        };

        activate();
        // ==============================================================================================================================================================
    };

    // FACTORY ================================================================================================================================================================================
    // ========================================================================================================================================================================================
    // =========================================================================================================================================================================================
    angular.module('entifix-js').factory('EntifixDownloadReportSettings', downloadReportSettingsFactory);
    
    downloadReportSettingsFactory.$inject = ['$mdDialog'];

    function downloadReportSettingsFactory($mdDialog)
    {
        var downloadReportSettingsController = function()
        {
            var vm = this;

            // Properties and Fields _______________________________________________________________________________________________________________________________________________________            
            //==============================================================================================================================================================================

            //Fields ===>>>>:


            //Properties ===>>>>:
            
            
            //==============================================================================================================================================================================

            // Methods _____________________________________________________________________________________________________________________________________________________________________
            //==============================================================================================================================================================================
            vm.chooseDownloadReportSettings = (callbackSuccess, callbackError) => 
            {
                $mdDialog.show({
                                    //templateUrl: 'src/shared/controls/entifixDownloadReportSettings/entifixDownloadReportSettings.html',
                                    template: '<md-dialog aria-label="Configuración del reporte" class="md-sm"> \
                                                    <md-toolbar md-colors="{background: \'default-primary-100\'}"> \
                                                        <div class="md-toolbar-tools" layout> \
                                                            <div flex layout layout-align="start center"> \
                                                                <div class="md-icon-button"><md-icon class="material-icons">chrome_reader_mode</md-icon></div> \
                                                                <h2>&nbsp {{vm.header}}</h2> \
                                                            </div> \
                                                        </div> \
                                                    </md-toolbar> \
                                                    <div> \
                                                        <md-dialog-content> \
                                                            <md-content layout-padding> \
                                                                <div flex> \
                                                                    <entifix-select  \
                                                                        value-model="vm.entity.pageSize"  \
                                                                        show-editable-fields="true" \
                                                                        component-construction="vm.pageSizeComponentConstruction"  \
                                                                        component-binding-out="vm.pageSizeInstance"> \
                                                                    </entifix-select> \
                                                                </div> \
                                                                <div flex> \
                                                                    <entifix-checkbox-switch  \
                                                                        value-model="vm.entity.tableStriped"  \
                                                                        show-editable-fields="true" \
                                                                        component-construction="vm.tableStripedComponentConstruction"> \
                                                                    </entifix-checkbox-switch> \
                                                                </div> \
                                                                <div flex> \
                                                                    <entifix-select  \
                                                                        value-model="vm.entity.pageOrientation"  \
                                                                        show-editable-fields="true" \
                                                                        component-construction="vm.pageOrientationComponentConstruction"  \
                                                                        component-binding-out="vm.pageOrientationInstance"> \
                                                                    </entifix-select> \
                                                                </div> \
                                                            </md-content> \
                                                        </md-dialog-content> \
                                                        <md-dialog-actions layout="row"> \
                                                            <md-button ng-click="vm.cancel()"> \
                                                                <md-icon class="material-icons">clear</md-icon> Cancelar \
                                                            </md-button> \
                                                            <md-button  ng-click="vm.ok()"> \
                                                                <md-icon class="material-icons">done</md-icon> Ok \
                                                            </md-button> \
                                                        </md-dialog-actions> \
                                                    </div> \
                                                </md-dialog>',
                                    controller: 'EntifixDownloadReportSettingsController',
                                    parent: angular.element(document.body),
                                    clickOutsideToClose: false,
                                    escapeToClose: false,
                                    fullscreen: true,
                                    controllerAs: 'vm'
                                })
                .then((result) => { if(callbackSuccess) callbackSuccess(result); }, (result) => { if(callbackError) callbackError(result); });
            };

            //==============================================================================================================================================================================

        };

        return downloadReportSettingsController;
    };

})();