(function() {
    'use strict';

    componentController.$inject = ['$stateParams', '$state', '$timeout', 'EntifixEntityModal', 'EntifixNotification', '$rootScope'];

    function componentController($stateParams, $state, $timeout, EntifixEntityModal, EntifixNotification, $rootScope)
    {
        var vm = this;

        vm.$onInit = function()
        {
            setdefaults();
            activate();
        };

        // Init Methods
        // ==============================================================================================================================================================

        function setdefaults()
        {
            // Defaults for table =======================================================================================================================================

            vm.componentConstruction.reload = vm.reload;
            
            if (checkDefaultTableConstruction('search'))
            {
                if (!vm.tableComponentConstruction.search)
                    vm.tableComponentConstruction.search = {};
            }

            if (checkDefaultTableConstruction('edit'))
            {
                if (!vm.tableComponentConstruction.edit)
                    vm.tableComponentConstruction.edit = {};

                var personalizeEditTable = vm.tableComponentConstruction.edit.customAction;

                vm.tableComponentConstruction.edit.customAction = (entity) =>
                {
                    if (personalizeEditTable)
                        personalizeEditTable(entity);
                    else 
                    {
                        vm.entityQueryDetails.resource.loadAsResource(entity.id, (entity) => {
                            if (vm.isModal.get())
                                vm.openModal(entity);
                            else
                                vm.changeToSingleView(entity);
                        } );
                    }
                };
            }

            if (checkDefaultTableConstruction('add'))
            {
                if (!vm.tableComponentConstruction.add)
                    vm.tableComponentConstruction.add = {};
                
                var personalizeAddTable = vm.tableComponentConstruction.add.customAction;

                vm.tableComponentConstruction.add.customAction = () =>
                {
                    if (personalizeAddTable)
                        personalizeAddTable();
                    else
                    {
                        if (vm.isModal.get())
                            vm.openModal();
                        else
                            vm.changeToSingleView();
                    }
                };
            }

            if (checkDefaultTableConstruction('remove'))
            {
                if (!vm.tableComponentConstruction.remove)
                    vm.tableComponentConstruction.remove = {};

                var personalizeRemoveTable = vm.tableComponentConstruction.remove.customAction;

                if (personalizeRemoveTable)
                    vm.tableComponentConstruction.remove.customAction = (entity) => { personalizeRemoveTable(entity); }
            };

            if (vm.isProcessEntity.get())
            {
                if (checkDefaultTableConstruction('process'))
                {
                    if (!vm.tableComponentConstruction.process)
                        vm.tableComponentConstruction.process = {};

                    var personalizeProcessTable = vm.tableComponentConstruction.process.customAction;

                    if (personalizeProcessTable)
                        vm.tableComponentConstruction.process.customAction = (entity) => { personalizeProcessTable(entity); }
                };
            }
            
            if (!vm.tableQueryDetails)
                vm.tableQueryDetails = vm.queryDetails;
                
            if (!vm.entityQueryDetails)
                vm.entityQueryDetails = vm.queryDetails;
               
            if (!vm.isModal.get())
            {
                // Defaults for entity form =============================================================================================================================
                if (checkDefaultEntityConstruction('cancel'))
                {
                    if (!vm.entityComponentConstruction.cancel)
                        vm.entityComponentConstruction.cancel = {};

                    var personalizeCancelEntity = vm.entityComponentConstruction.cancel.customAction;

                    vm.entityComponentConstruction.cancel.customAction = () =>
                    {
                        if (personalizeCancelEntity)
                            personalizeCancelEntity();
                        else
                        {
                            if (vm.entityQueryDetails.resource.isNewEntity(vm.entityComponentBindingOut.entity.get()))
                                vm.changeToMainView();
                            else
                                loadEntity();
                        }
                    };
                }

                if (checkDefaultEntityConstruction('ok'))
                {
                    if (!vm.entityComponentConstruction.ok)
                        vm.entityComponentConstruction.ok = {};
                        
                    var personalizeOkEntity = vm.entityComponentConstruction.ok.customAction;

                    vm.entityComponentConstruction.ok.customAction = () =>
                    {
                        if (personalizeOkEntity)
                            personalizeOkEntity();
                        else
                            vm.changeToMainView();
                    };
                }

                if (checkDefaultEntityConstruction('edit'))
                {
                    if (!vm.entityComponentConstruction.edit)
                        vm.entityComponentConstruction.edit = {};
                        
                    var personalizeEditEntity = vm.entityComponentConstruction.edit.customAction;
    
                    if (personalizeEditEntity)
                        vm.entityComponentConstruction.edit.customAction = (entity) => { personalizeEditEntity(entity); }

                }

                if (checkDefaultEntityConstruction('save'))
                {
                    if (!vm.entityComponentConstruction.save)
                        vm.entityComponentConstruction.save = {};
                    
                    vm.entityComponentConstruction.save.autoChange = false;
                        
                    var personalizeSaveEntity = vm.entityComponentConstruction.save.customAction;
    
                    if (personalizeSaveEntity)
                        vm.entityComponentConstruction.save.customAction = (entity) => { personalizeSaveEntity(entity); }
                }

                if (checkDefaultEntityConstruction('remove'))
                {
                    if (!vm.entityComponentConstruction.remove)
                        vm.entityComponentConstruction.remove = {};
                        
                    var personalizeRemoveEntity = vm.entityComponentConstruction.remove.customAction;
    
                    if (personalizeRemoveEntity)
                        vm.entityComponentConstruction.remove.customAction = (entity) => { personalizeRemoveEntity(entity); }
                }

                if (vm.isProcessEntity.get())
                {
                    if (!vm.entityComponentConstruction.process)
                        vm.entityComponentConstruction.process = {};
                        
                    var personalizeProcessEntity = vm.entityComponentConstruction.process.customAction;

                    vm.entityComponentConstruction.process.customAction = (entity, setViewState) => 
                                                                        {
                                                                            if (personalizeProcessEntity)
                                                                                personalizeProcessEntity(entity, setViewState)
                                                                            else
                                                                            {
                                                                                var ent = {};
                                                                                ent[vm.entityQueryDetails.resource.getKeyProperty.get()] = entity[vm.entityQueryDetails.resource.getKeyProperty.get()];
                                                                                ent[vm.entityQueryDetails.resource.getOpProperty.get()] = 'PROCESAR';
                                                                                saveModal(ent, null, setViewState);
                                                                            }
                                                                        };
                }

                vm.tableComponentConstruction.blockTableOnChangeView = true;
                vm.entityComponentConstruction.canViewHistory = vm.canViewHistory;

                vm.entityQueryDetails.resource.listenSaved( (args) => {
                    if (vm.entityComponentConstruction.save.autoChange == false)
                        vm.changeToSingleView(args.fullResponse.data.data[0]);
                    else
                        vm.changeToMainView();
                });
                vm.entityQueryDetails.resource.listenDeleted( () => {
                    if (vm.entityComponentConstruction.remove.autoChange != false)
                        vm.changeToMainView();
                });
            }
        };

        function checkDefaultTableConstruction(defaultValueName)
        {
            if (vm.tableComponentConstruction.useDefaults == null || vm.tableComponentConstruction.useDefaults == true)
                return true;

            if (vm.tableComponentConstruction.defaultValuesAllowed && vm.tableComponentConstruction.defaultValuesAllowed.length > 0)
                return vm.tableComponentConstruction.defaultValuesAllowed.filter( (valueName) => { return valueName == defaultValueName; } ).length > 0;
        }

        function checkDefaultEntityConstruction(defaultValueName)
        {
            if (vm.entityComponentConstruction.useDefaults == null || vm.entityComponentConstruction.useDefaults == true)
                return true;

            if (vm.entityComponentConstruction.defaultValuesAllowed && vm.entityComponentConstruction.defaultValuesAllowed.length > 0)
                return vm.entityComponentConstruction.defaultValuesAllowed.filter( (valueName) => { return valueName == defaultValueName; } ).length > 0;
        }

        function activate()
        {
            if (!vm.isModal.get())
            {
                if ($stateParams[vm.paramName.get()])
                {
                    _state = _states.singleView; // The change of the state compile the component     

                    var initForm = () =>
                    {
                        if (vm.entityComponentBindingOut)
                        {
                            if ($stateParams[vm.paramName.get()] > 0)
                                loadEntity();
                            else 
                                createEntity();
                        }
                        else
                        {
                            console.log('Ciclo de inicializacion del formulario');
                            $timeout(initForm, 100);
                        }
                    };

                    initForm();
                }           
                else
                {
                    _state = _states.mainView;
                }
            }
        };

        function loadEntity()
        {
            vm.entityQueryDetails.resource.loadAsResource($stateParams[vm.paramName.get()], (entity) => { vm.entityComponentBindingOut.entity.set(entity); } );
            vm.entityComponentBindingOut.showEditableFields.set(false);
        };

        function createEntity()
        {
            vm.entityComponentBindingOut.entity.set( { } );
            vm.entityComponentBindingOut.showEditableFields.set(true);
        };

        // ==============================================================================================================================================================



        // Properties & fields
        // ==============================================================================================================================================================

        // Fields
        var _states = { mainView: 1, singleView: 2 };
        var _state = _states.mainView;


        // Properties
        vm.onMainView =
        {
            get: () => { return _state == _states.mainView; }
        };

        vm.onSingleView = 
        {
            get: () => { return _state == _states.singleView; }
        };

        vm.title = 
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.title)
                {
                    if (vm.componentConstruction.title.getter)
                        return vm.componentConstruction.title.getter(_state);
                    if (vm.componentConstruction.title.text)
                        return vm.componentConstruction.title.text;
                }

                return 'Catálogo';
            }
        };

        vm.icon = 
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.icon)
                {
                    if (vm.componentConstruction.icon.getter)
                        return vm.componentConstruction.icon.getter(_state);
                    return vm.componentConstruction.icon;                    
                }

                return '';
            }
        };

        vm.paramName =
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.paramName)
                    return vm.componentConstruction.paramName;

                //Default value
                return 'id';
            }
        };

        vm.useMainTab =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.useMainTab != null)
                    return vm.componentConstruction.useMainTab;

                return true;
            }
        };

        vm.showBar =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.showBar)
                {
                    if (vm.componentConstruction.showBar.getter)
                        return vm.componentConstruction.showBar.getter(_state);
                    return vm.componentConstruction.showBar;
                }

                return true;
            }
        }

        vm.isModal =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.isModal != null)
                    return vm.componentConstruction.isModal;

                return false;
            }
        };

        vm.closeWhenSaving =
        {
            get: () =>
            {
                if (vm.entityComponentConstruction && vm.entityComponentConstruction.closeWhenSaving != null)
                    return vm.entityComponentConstruction.closeWhenSaving;

                return true;
            }
        };

        vm.isProcessEntity =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.isProcessEntity != null)
                    return vm.componentConstruction.isProcessEntity;

                return false;
            }
        };

        vm.noFilterTooltip =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.noFilterTooltip != null)
                    return vm.componentConstruction.noFilterTooltip;
                
                return 'Quitar todos los filtros';
            }
        };

        vm.showNoFilter =
        {
            get: (skip) =>
            {
                if (vm.componentConstruction && vm.componentConstruction.showNoFilter != null)
                    return vm.componentConstruction.showNoFilter;
                else
                {
                    if (!skip)
                    {
                        if ($stateParams[vm.paramName.get()])
                            return false;
                        
                        return true;
                    }
                    else return true;
                }
            }
        };

        var _canViewHistory = true;
        vm.canViewHistory = 
        {
            get: () =>
            {
                if (_canViewHistory)
                {
                    if ($stateParams[vm.paramName.get()])
                        return true;
                    return false;
                }
                return false;
            },

            set: (value) =>
            {
                _canViewHistory = value;
            }
        }

        vm.historyTooltip =
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.historyTooltip)
                    return vm.componentConstruction.historyTooltip;

                //Default value
                return 'Mostrar Bitácora';
            } 
        };

        vm.history =
        {
            get: () => { return $rootScope.showHistory; },
            set: () => { $rootScope.showHistory = !$rootScope.showHistory; }
        };

        vm.reload = 
        {
            invoke: () =>
            {
                setdefaults();
            }
        }

        // ==============================================================================================================================================================
 


        // Methods
        // ==============================================================================================================================================================

        vm.changeToMainView = function()
        {
            $state.go($state.current.name, { [vm.paramName.get()]: null });
        };

        vm.changeToSingleView = function(entity)
        {
            var navid = -1;

            if (entity)
                navid = vm.entityQueryDetails.resource.getId(entity);
            
            if (vm.onSingleView.get() || (vm.tableComponentBindingOut.allowedActions.canEdit.get() && navid > 0) || (vm.tableComponentBindingOut.allowedActions.canAdd.get() && navid == -1) )
                $state.go($state.current.name, { [vm.paramName.get()]: navid });
        };

        vm.openModal = function(entity, event)
        {
            // Defaults for modal =======================================================================================================================================
            // Component Construction Configuration
            if (!vm.entityComponentConstruction)
                vm.entityComponentConstruction = {};

            if (checkDefaultEntityConstruction('cancel'))
                if (!vm.entityComponentConstruction.cancel)
                    vm.entityComponentConstruction.cancel = {};

            if (checkDefaultEntityConstruction('edit'))
                if (!vm.entityComponentConstruction.edit)
                    vm.entityComponentConstruction.edit = {};

            if (checkDefaultEntityConstruction('ok'))
                if (!vm.entityComponentConstruction.ok)
                    vm.entityComponentConstruction.ok = {};

            if (checkDefaultEntityConstruction('save'))
            {
                if (!vm.entityComponentConstruction.save)
                    vm.entityComponentConstruction.save = {};
                
                vm.entityComponentConstruction.save.customAction = (entity, defaultOk, setViewState) => 
                                                                    {
                                                                        saveModal(entity, defaultOk, setViewState);
                                                                    };
            }

            if (checkDefaultEntityConstruction('remove'))
            {
                if (!vm.entityComponentConstruction.remove)
                    vm.entityComponentConstruction.remove = {};

                vm.entityComponentConstruction.remove.customAction = (entity, defaultOk, setViewState) => 
                                                                    {
                                                                        EntifixNotification.confirm('Está seguro de eliminar el registro', 'Confirmación requerida', 
                                                                                                () => 
                                                                                                {
                                                                                                    vm.entityQueryDetails.resource.deleteEntity(entity, () => { defaultOk(); $timeout(vm.tableComponentBindingOut.pager.reload(), 500); });
                                                                                                });
                                                                    };
            }

            vm.entityComponentConstruction.event = event;

            if (vm.isProcessEntity.get())
            {
                if (!vm.entityComponentConstruction.process)
                    vm.entityComponentConstruction.process = {};
                    
                vm.entityComponentConstruction.process.customAction = (entity, defaultOk, setViewState) => 
                                                                    {
                                                                        entity[vm.entityQueryDetails.resource.getOpProperty.get()] = 'PROCESAR';
                                                                        saveModal(entity, defaultOk, setViewState);
                                                                    };
            }
            
            // Query Details Configuration
            if (!vm.entityQueryDetails)
                vm.entityQueryDetails = vm.queryDetails;
                        
            // Component Binding Out Configuration
            if (!vm.entityComponentBindingOut)
                vm.entityComponentBindingOut = {};
            vm.entityComponentBindingOut.object = entity;

            // Component Behavior Configuration
            if (!vm.entityComponentBehavior)
                vm.entityComponentBehavior = {};
            
            // Creating new instance of EntifixEntityModal factory
            vm.modal = new EntifixEntityModal(vm.entityComponentConstruction, vm.entityComponentBehavior, vm.entityComponentBindingOut, vm.entityQueryDetails);
            
            // Call openModal method for call the modal behavior in its controller
            vm.modal.openModal();
        };

        function saveModal(entity, defaultOk, setViewState)
        {
            vm.entityQueryDetails.resource.
                saveEntity(entity,  (response, saveSuccess) => 
                {
                    if (saveSuccess)
                    {
                        if (defaultOk && vm.closeWhenSaving.get())
                            defaultOk();
                        else if (response && response.data.data[0])
                            setViewState(true, response.data.data[0]);
                        if (vm.tableComponentBindingOut && vm.tableComponentBindingOut.pager)
                            $timeout(vm.tableComponentBindingOut.pager.reload(), 500);
                    }
                });
        }

        // ==============================================================================================================================================================

    };

    var component = 
    {
        templateUrl: 'src/shared/components/entifixCatalog/entifixCatalog.html',
        controller: componentController,
        controllerAs: 'bindCtrl',
        bindings: 
        { 
          componentConstruction: '<',
          queryDetails: '<',
          tableComponentConstruction: '<',
          tableComponentBehavior: '<',
          tableComponentBindingOut: '=',
          tableQueryDetails: '=',
          entityComponentConstruction: '<',
          entityComponentBehavior: '<',
          entityComponentBindingOut: '=',
          entityQueryDetails: '='
        }
    };

    //Register component
    angular.module('entifix-js').component('entifixCatalog', component);

})();