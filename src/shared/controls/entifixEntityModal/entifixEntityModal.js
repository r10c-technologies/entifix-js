(function(){
    'use strict';

    var entifixEnvironmentModule = angular.module('entifix-js');

    // CONTROLLER ================================================================================================================================================================================
    // ========================================================================================================================================================================================
    // =========================================================================================================================================================================================
    entifixEnvironmentModule.controller('EntifixEntityModalController', controller);

    controller.$inject = ['$mdDialog', 'EntifixNotifier', '$timeout', 'BaseComponentFunctions', 'EntifixNotification', 'EntifixSession', '$rootScope', 'componentConstruction', 'componentBehavior', 'componentBindingOut', 'queryDetails'];

    function controller ($mdDialog, EntifixNotifier, $timeout, BaseComponentFunctions, EntifixNotification, EntifixSession, $rootScope, componentConstruction, componentBehavior, componentBindingOut, queryDetails) 
    {
        var vm = this;

        vm.componentConstruction = componentConstruction();
        vm.componentBehavior = componentBehavior();
        vm.componentBindingOut = componentBindingOut();
        vm.queryDetails = queryDetails();

        // Properties & Fields ===================================================================================================================================================
        
        //Fields
        var _isloading = false;
        var _notifier = null;
        
        var _statesForm = 
        {
            edit: true,
            view: false
        }; 

        vm.connectionComponent = { };
        vm.connectionComponent.state = _statesForm.edit;

        // Main

        vm.entity = 
        {
            get: () => 
            { 
                if (vm.connectionComponent)
                    return vm.connectionComponent.entity;
                return null;
            },
            set: (value) =>
            {
                if (vm.connectionComponent)
                {
                    var oldValue = vm.connectionComponent.entity;
                    vm.connectionComponent.entity = value;

                    if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onChangeEntity)
                        vm.componentBehavior.events.onChangeEntity(oldValue, value);
                }
            }
        };

        vm.isLoading =
        {
            get: ()=> 
            {
                if (vm.queryDetails && vm.queryDetails.resource)
                    return vm.queryDetails.resource.isLoading.get();
                return false;   
            }
        };

        vm.isSaving =
        {
            get: ()=> 
            {
                if (vm.queryDetails && vm.queryDetails.resource)
                    return vm.queryDetails.resource.isSaving.get();
                return false;   
            }
        };

        vm.isDeleting =
        {
            get: ()=> 
            {
                if (vm.queryDetails && vm.queryDetails.resource)
                    return vm.queryDetails.resource.isDeleting.get();
                return false;
            }
        };

        vm.onTask = 
        {
            get: () => 
            {
                var response = vm.isLoading.get() || vm.isSaving.get() || vm.isDeleting.get();

                return response; 
            }
        };

        vm.size = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.size)
                    return vm.componentConstruction.size;

                //Default value
                return 'md-md';
            }
        };

        vm.title = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.title)
                {
                    if (vm.componentConstruction.title.entityName)
                    {
                        if (!vm.connectionComponent.showEditableFields.get())
                            return 'Editar ' + vm.componentConstruction.title.entityName;
                        else
                            return 'Agregar ' + vm.componentConstruction.title.entityName;
                    }

                    if (vm.componentConstruction.title.entityProperty && vm.entity.get())
                    {
                        if (!vm.connectionComponent.showEditableFields.get())
                            return 'Editar ' + vm.entity.get()[vm.componentConstruction.title.entityProperty];
                        else
                            return 'Agregar ' + vm.entity.get()[vm.componentConstruction.title.entityProperty];
                    }

                    if (vm.componentConstruction.title.getter)
                        return vm.componentConstruction.title.getter();
                    
                    if (vm.componentConstruction.title.text)
                        return vm.componentConstruction.title.text;
                }

                //Default value
                if (!vm.connectionComponent.showEditableFields.get())
                    return 'Editar Registro';
                return 'Agregar Registro';
            }
        };

        vm.icon =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.icon)
                {   
                    if (vm.componentConstruction.icon.text)
                        return vm.componentConstruction.icon.text;
                }

                //Default value
                return 'menu';
            }
        };

        // cancel button
        vm.canCancel = 
        {            
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.cancel && vm.connectionComponent.state == _statesForm.edit)
                    return true;

                //Default value
                return false;
            }
        };

        vm.cancelIcon =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.cancel && vm.componentConstruction.cancel.icon)
                    return  vm.componentConstruction.cancel.icon;

                //Default value
                return 'clear';
            }
        };

        vm.cancelText =
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.cancel && vm.componentConstruction.cancel.text)
                {
                    if (vm.componentConstruction.cancel.text.getter)
                        return vm.componentConstruction.cancel.text.getter();
                    else if (vm.componentConstruction.cancel.text)
                        return vm.componentConstruction.cancel.text;
                };

                //Default value
                return 'Cancelar';
            } 
        };

        vm.cancelHref =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.cancel && vm.componentConstruction.cancel.href)
                {
                    if (vm.componentConstruction.cancel.href instanceof Object && vm.componentConstruction.cancel.href.getter)
                        return vm.componentConstruction.cancel.href.getter(vm.entity.get(), vm.queryDetails.resource);
                    return vm.componentConstruction.cancel.href;
                }

                //Default value
                return null;
            }
        };

        // ok button
        vm.canOk = 
        {            
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.ok && vm.connectionComponent.state == _statesForm.view)
                    return true;

                //Default value
                return false;
            }
        };

        vm.okIcon =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.ok && vm.componentConstruction.ok.icon)
                    return  vm.componentConstruction.ok.icon;

                //Default value
                return 'done';
            }
        };

        vm.okText =
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.ok &&  vm.componentConstruction.ok.text)
                    return '' + vm.componentConstruction.ok.text;

                //Default value
                return 'Aceptar';
            } 
        };

        // edit button
        vm.canEdit = 
        {            
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.queryDetails && vm.queryDetails.resource && vm.entity.get() && !vm.queryDetails.resource.isNewEntity(vm.entity.get()) && vm.connectionComponent.state == _statesForm.view)
                    return true;

                //Default value
                return false;
            }
        };

        vm.editIcon =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.componentConstruction.edit.icon)
                    return  vm.componentConstruction.edit.icon;

                //Default value
                return 'create';
            }
        };

        vm.editText =
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.edit)
                {
                    if (vm.componentConstruction.edit.text instanceof Object && vm.componentConstruction.edit.text.getter)
                        return vm.componentConstruction.edit.text.getter();
                    else if (vm.componentConstruction.edit.text)
                        return vm.componentConstruction.edit.text;
                };

                //Default value
                return 'Editar';
            } 
        };

        vm.editHref =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.componentConstruction.edit.href)
                {
                    if (vm.componentConstruction.edit.href instanceof Object && vm.componentConstruction.edit.href.getter)
                        return vm.componentConstruction.edit.href.getter(vm.entity.get(), vm.queryDetails.resource);
                    return vm.componentConstruction.edit.href;
                }

                //Default value
                return null;
            }
        };

        // save button
        vm.canSave = 
        {            
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.save && vm.connectionComponent.state == _statesForm.edit)
                    return true;

                //Default value
                return false;
            }
        };

        vm.saveIcon =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.save &&  vm.componentConstruction.save.icon)
                    return '' + vm.componentConstruction.save.icon;

                //Default value
                return 'save';
            }   
        };

        vm.saveText =
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.save)
                {
                    if (vm.componentConstruction.save.text instanceof Object && vm.componentConstruction.save.text.getter)
                        return vm.componentConstruction.save.text.getter();
                    else if (vm.componentConstruction.save.text)
                        return vm.componentConstruction.save.text;
                };

                //Default value
                return 'Guardar';
            } 
        };

        vm.saveHref =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.save && vm.componentConstruction.save.href)
                {
                    if (vm.componentConstruction.save.href instanceof Object && vm.componentConstruction.save.href.getter)
                        return vm.componentConstruction.save.href.getter(vm.entity.get(), vm.queryDetails.resource);
                    return vm.componentConstruction.save.href;
                }

                //Default value
                return null;
            }
        };

        // remove button
        vm.canRemove = 
        {            
            get: () =>
            {                
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.queryDetails && vm.queryDetails.resource && vm.entity.get() && !vm.queryDetails.resource.isNewEntity(vm.entity.get()) && vm.connectionComponent.state == _statesForm.edit)
                    return true;

                //Default value
                return false;
            }
        };

        vm.removeIcon =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.componentConstruction.remove.icon)
                    return  vm.componentConstruction.remove.icon;

                //Default value
                return 'delete';
            }
        };

        vm.removeText =
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.remove)
                {
                    if (vm.componentConstruction.remove.text instanceof Object && vm.componentConstruction.remove.text.getter)
                        return vm.componentConstruction.remove.text.getter();
                    else if (vm.componentConstruction.remove.text)
                        return vm.componentConstruction.remove.text;
                };

                //Default value
                return 'Eliminar';
            } 
        };

        vm.removeHref =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.componentConstruction.remove.href)
                {
                    if (vm.componentConstruction.remove.href instanceof Object && vm.componentConstruction.remove.href.getter)
                        return vm.componentConstruction.remove.href.getter(vm.entity.get(), vm.queryDetails.resource);
                    return vm.componentConstruction.remove.href;
                }

                //Default value
                return null;
            }
        };

        //process button
        vm.canProcess = 
        {            
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.process && vm.connectionComponent.state == _statesForm.view && vm.queryDetails && vm.queryDetails.resource && vm.entity.get() && !vm.queryDetails.resource.isNewEntity(vm.entity.get()) && !vm.queryDetails.resource.isProcessedEntity(vm.entity.get()))
                    return true;

                //Default value
                return false;
            }
        };

        vm.processIcon =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.process && vm.componentConstruction.process.icon)
                    return  vm.componentConstruction.process.icon;

                //Default value
                return 'done_all';
            }
        };

        vm.processText =
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.process &&  vm.componentConstruction.process.text)
                    return '' + vm.componentConstruction.process.text;

                //Default value
                return 'Procesar';
            } 
        };

        vm.allowActions =
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.allowActions != null)
                    return vm.componentConstruction.allowActions;

                //Default value
                return true;
            } 
        };

        vm.saveTooltip =
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.saveTooltip)
                    return vm.componentConstruction.saveTooltip;

                //Default value
                return 'Todos los campos obligatorios deben estar correctos';
            } 
        };

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

        var _canViewHistory = true;
        vm.canViewHistory = 
        {
            get: () =>
            {
                if (_canViewHistory)
                    return true;
                return false;
            },

            set: (value) =>
            {
                _canViewHistory = value;
            }
        }

        vm.history =
        {
            get: () => { return $rootScope.showHistory; },
            set: () => { $rootScope.showHistory = !$rootScope.showHistory; }
        };

        vm.hasPermissions = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.permissions != null)
                    return true;

                //Default value
                return false;
            }
        }

        vm.hasAllPermission = 
        {
            get: () =>
            {
                if (vm.componentConstruction.permissions.all != null && EntifixSession.checkPermissions(vm.componentConstruction.permissions.all))
                    return true;

                //Default value
                return false;
            }
        }

        vm.hasSavePermission = 
        {
            get: () =>
            {
                if (!vm.componentConstruction.permissions.save || (vm.componentConstruction.permissions.save != null && EntifixSession.checkPermissions(vm.componentConstruction.permissions.save)))
                    return true;

                //Default value
                return false;
            }
        }

        vm.hasEditPermission = 
        {
            get: () =>
            {
                if (!vm.componentConstruction.permissions.edit || (m.componentConstruction.permissions.edit != null && EntifixSession.checkPermissions(vm.componentConstruction.permissions.edit)))
                    return true;

                //Default value
                return false;
            }
        }

        vm.hasRemovePermission = 
        {
            get: () =>
            {
                if (!vm.componentConstruction.permissions.remove || (vm.componentConstruction.permissions.remove != null && EntifixSession.checkPermissions(vm.componentConstruction.permissions.remove)))
                    return true;

                //Default value
                return false;
            }
        }

        vm.hasProcessPermission = 
        {
            get: () =>
            {
                if (!vm.componentConstruction.permissions.process || (vm.componentConstruction.permissions.process != null && EntifixSession.checkPermissions(vm.componentConstruction.permissions.process)))
                    return true;

                //Default value
                return false;
            }
        }

        // =======================================================================================================================================================================
        
        // Methods ===============================================================================================================================================================

        function activate()
        {
            setdefaults();
            createconnectioncomponent();
            
            if (vm.componentConstruction)
               createDynamicComponent();

            checkoutputs();
            checkPermissions();

        };

        function setdefaults()
        {
            _notifier = new EntifixNotifier(vm.queryDetails.resource);
        };

        function createconnectioncomponent()
        {
            // Connection Component Properties __________________________________________________________________________________________
            // ==========================================================================================================================

            vm.connectionComponent.IsCreating = true;

            if (vm.componentBindingOut.object)
            {
                vm.connectionComponent.state = _statesForm.view;
                vm.entity.set(vm.componentBindingOut.object);
            }
            else
                vm.entity.set({ });

            vm.connectionComponent.entity = vm.entity.get();
            if (vm.queryDetails.resource)
            {
                vm.connectionComponent.resource = vm.queryDetails.resource;
            }

            vm.connectionComponent.showEditableFields =
            {
                get: () =>
                {
                    return (vm.connectionComponent.state == _statesForm.edit);
                },
                set: (value) =>
                {
                    if (value == true)
                        vm.connectionComponent.state = _statesForm.edit;
                    if (value == false)
                        vm.connectionComponent.state = _statesForm.view;
                }
            };

            vm.connectionComponent.state = vm.connectionComponent.showEditableFields.get();
            vm.connectionComponent.isSaving = vm.isSaving;
            vm.connectionComponent.history = vm.history;
            vm.connectionComponent.canViewHistory = vm.canViewHistory;

            vm.connectionComponent.canCancel = { get: ()=> { return vm.canCancel.get(); }};
            vm.connectionComponent.canRemove = { get: ()=> { return vm.canRemove.get(); }};
            vm.connectionComponent.canSave = { get: ()=> { return vm.canSave.get(); }};
            vm.connectionComponent.canEdit = { get: ()=> { return vm.canEdit.get(); }};
            vm.connectionComponent.canOk = { get: ()=> { return vm.canOk.get(); }};
            vm.connectionComponent.canProcess = { get: ()=> { return vm.canProcess.get(); }};

            vm.connectionComponent.cancelText = { get: ()=> { return vm.cancelText.get(); }};
            vm.connectionComponent.removeText = { get: ()=> { return vm.removeText.get(); }};
            vm.connectionComponent.saveText = { get: ()=> { return vm.saveText.get(); }};
            vm.connectionComponent.editText = { get: ()=> { return vm.editText.get(); }};
            vm.connectionComponent.okText = { get: ()=> { return vm.okText.get(); }};
            vm.connectionComponent.processText = { get: ()=> { return vm.processText.get(); }};

            vm.connectionComponent.cancelIcon = { get: ()=> { return vm.cancelIcon.get(); }};
            vm.connectionComponent.removeIcon = { get: ()=> { return vm.removeIcon.get(); }};
            vm.connectionComponent.saveIcon = { get: ()=> { return vm.saveIcon.get(); }};
            vm.connectionComponent.editIcon = { get: ()=> { return vm.editIcon.get(); }};
            vm.connectionComponent.okIcon = { get: ()=> { return vm.okIcon.get(); }};
            vm.connectionComponent.processIcon = { get: ()=> { return vm.processIcon.get(); }};

            vm.connectionComponent.cancel = { invoke: ()=> { vm.cancel(); }};
            vm.connectionComponent.remove = { invoke: ()=> { vm.remove(); }};
            vm.connectionComponent.edit = { invoke: ()=> { vm.edit(); }};
            vm.connectionComponent.ok = { invoke: ()=> { vm.ok(); }};
            vm.connectionComponent.save = { invoke: ()=> { vm.save(); }};
            vm.connectionComponent.process = { invoke: ()=> { vm.process(); }};

            vm.connectionComponent.onTask = { get: ()=> { return vm.onTask.get(); }}
            vm.connectionComponent.saveTooltip = { get: ()=> { return vm.saveTooltip.get(); }}
            vm.connectionComponent.entityForm = { valid: ()=> { return vm.entityForm.$valid; }};

            vm.connectionComponent.evaluateErrors = 
            {
                get: (name) =>
                {
                    return evaluateErrors(name);
                }
            }

            function evaluateErrors(property)
            {
                var errors = {};
                for (var error in vm.entityForm.$error)
                {
                    var propertyValue = vm.entityForm.$error[error];

                    if (propertyValue instanceof Array)
                        propertyValue.forEach((element) => { if (element.$name == property) errors[error] = true; });
                }

                return errors;
            }

            // ==========================================================================================================================




            // Connection Component Methods _____________________________________________________________________________________________
            // ==========================================================================================================================

            var searchForm = () =>
            {
                if (vm.entityForm)
                    vm.connectionComponent.entityForm = vm.entityForm;
                else
                    $timeout(searchForm, 200);
            };

            searchForm();
        };

        function createDynamicComponent()
        {
            var res = BaseComponentFunctions.CreateStringHtmlComponentAndBindings(vm.componentConstruction, 'bindCtrl.connectionComponent.objectBindings'); 
            vm.stringhtmlcomponent = res.stringhtml;
            vm.connectionComponent.objectBindings = res.objectbindings;
        };

        function checkoutputs()
        {
            vm.componentBindingOut = 
            { 
                showEditableFields: vm.connectionComponent.showEditableFields,
                entity: vm.entity,
                recreateDynamicComponent: createDynamicComponent 
            };

            if (vm.componentBehavior && vm.componentBehavior.afterConstruction)
                vm.componentBehavior.afterConstruction();
        };

        vm.cancel = function()
        {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onCancel)
                vm.componentBehavior.events.onCancel();
            
            if (vm.componentConstruction.cancel.customAction)
                vm.componentConstruction.cancel.customAction();
            else
                defaultCancel();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onCanceled)
                vm.componentBehavior.events.onCanceled();
        };

        vm.ok = function()
        {            
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onOk)
                vm.componentBehavior.events.onOk();
            
            if (vm.componentConstruction.ok.customAction)
                vm.componentConstruction.ok.customAction(defaultOk);
            else
                defaultOk();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onAfterOk)
                vm.componentBehavior.events.onAfterOk();
        };

        vm.edit = function()
        {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onEdit)
                vm.componentBehavior.events.onEdit();
            
            if (vm.componentConstruction.edit.customAction)
                vm.componentConstruction.edit.customAction(vm.entity.get(), defaultOk);
            else
                defaultEdit();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onEdited)
                vm.componentBehavior.events.onEdited();
        };

        vm.save = function()
        {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onSave)
                vm.componentBehavior.events.onSave(vm.entity.get());
            
            if (vm.componentConstruction.save.customAction)
                vm.componentConstruction.save.customAction(vm.entity.get(), defaultOk, setViewState);
            else
                defaultSave();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onSaved)
                vm.componentBehavior.events.onSaved();
        };

        vm.remove = function()
        {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onRemove)
                vm.componentBehavior.events.onRemove();
            
            if (vm.componentConstruction.remove.customAction)
                vm.componentConstruction.remove.customAction(vm.entity.get(), defaultOk);
            else
                defaultRemove();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onRemoved)
                vm.componentBehavior.events.onRemoved();
        };

        vm.process = function()
        {            
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onProcess)
                vm.componentBehavior.events.onProcess();
            
            if (vm.componentConstruction.process.customAction)
                vm.componentConstruction.process.customAction(vm.entity.get(), defaultOk, setViewState);
            else
                defaultProcess();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onProcessed)
                vm.componentBehavior.events.onProcessed();
        };

        function defaultCancel()
        {
            if (vm.queryDetails.resource.isNewEntity(vm.connectionComponent.entity))
                $mdDialog.cancel();
            else
            {
                vm.connectionComponent.state = _statesForm.view;
                reloadEntity();
            }
        };

        function defaultOk()
        {
            $mdDialog.hide();
        };

        function defaultEdit()
        {
            vm.connectionComponent.state = _statesForm.edit;
        };

        function defaultSave()
        {
            vm.queryDetails.resource.saveEntity(vm.connectionComponent.entity,  (response, saveSuccess) => 
                                                                                {
                                                                                    if (saveSuccess)
                                                                                    {
                                                                                        if (response && response.data.data)
                                                                                            vm.entity.set(response.data.data);
                                                                                        defaultOk();
                                                                                    }
                                                                                });
        };

        function defaultProcess()
        {
            vm.connectionComponent.entity[vm.queryDetails.resource.getOpProperty.get()] = 'PROCESAR';
            defaultSave();
        };

        function defaultRemove()
        {
            EntifixNotification.confirm({
                                    "body": "Está seguro de eliminar el registro", 
                                    "header": "Confirmación requerida", 
                                    "actionConfirm": () => 
                                    {
                                        vm.queryDetails.resource.deleteEntity(vm.connectionComponent.entity, () => { defaultOk(); });
                                    },
                                    "actionCancel": () =>
                                    {
                                        
                                    }});
        };

        vm.submit = function()
        {
            vm.save();
        };

        function reloadEntity()
        {
            if (vm.entity.get())
                vm.queryDetails.resource.loadAsResource(vm.entity.get(), (entityReloaded) => { vm.entity.set(entityReloaded); });
        };

        function checkPermissions()
        {
            if (vm.hasPermissions.get())
            {
                if (!vm.hasAllPermission.get())
                {
                    if (!vm.hasSavePermission.get())
                        delete vm.componentConstruction.save;
                    if (!vm.hasEditPermission.get())
                        delete vm.componentConstruction.edit;
                    if (!vm.hasRemovePermission.get())
                        delete vm.componentConstruction.remove;
                    if (!vm.hasProcessPermission.get())
                        delete vm.componentConstruction.process;
                }
            }
        }

        // =======================================================================================================================================================================
        
        function setViewState(view, entity)
        {
            if (view)
                vm.connectionComponent.state = _statesForm.view;
            else
                vm.connectionComponent.state = _statesForm.edit;

            vm.entity.set(entity);
        }

        activate();

    };
        



    // FACTORY ================================================================================================================================================================================
    // ========================================================================================================================================================================================
    // =========================================================================================================================================================================================
    entifixEnvironmentModule.factory('EntifixEntityModal', entityModal);
    entityModal.$inject = ['$mdDialog'];

    function entityModal($mdDialog)
    {
        var entityModal = function(componentConstruction, componentBehavior, componentBindingOut, queryDetails)
        {
            var vm = this;

            // Properties and Fields _______________________________________________________________________________________________________________________________________________________            
            //==============================================================================================================================================================================

            //Fields ===>>>>:


            //Properties ===>>>>:
            
            
            //==============================================================================================================================================================================




            // Methods _____________________________________________________________________________________________________________________________________________________________________
            //==============================================================================================================================================================================
            vm.openModal = function (callback) 
            {
                if (componentConstruction && componentConstruction.event)
                    var event = componentConstruction.event;

                if (componentConstruction && componentConstruction.clickOutsideToClose != null)
                    var clickOutsideToClose = componentConstruction.clickOutsideToClose;
                else
                    var clickOutsideToClose = false;

                if (componentConstruction && componentConstruction.escapeToClose != null)
                    var escapeToClose = componentConstruction.escapeToClose;
                else
                    var escapeToClose = true;

                if (componentConstruction && componentConstruction.fullscreen != null)
                    var fullscreen = componentConstruction.fullscreen;
                else
                    var fullscreen = true;

                $mdDialog.show({
                                    //templateUrl: 'src/shared/controls/entifixEntityModal/entifixEntityModal.html',
                                    template: '<md-dialog aria-label="{{bindCtrl.title.get()}}" ng-class="{\'whirl double-up whirlback\': bindCtrl.onTask.get() }" class="{{bindCtrl.size.get()}}"> \
                                                    <md-toolbar md-colors="{background:\'default-primary-500\'}"> \
                                                        <div class="md-toolbar-tools" layout> \
                                                            <div flex layout layout-align="start center"> \
                                                                <div class="md-icon-button"><md-icon class="material-icons">{{bindCtrl.icon.get()}}</md-icon></div> \
                                                                <h2>&nbsp{{bindCtrl.title.get()}}</h2> \
                                                            </div> \
                                                            <div flex layout layout-align="end center" ng-if="bindCtrl.canViewHistory.get()"> \
                                                                <md-button layout layout-align="end end" class="md-primary text-success md-fab md-mini" ng-click="bindCtrl.history.set()"> \
                                                                    <md-tooltip>{{bindCtrl.historyTooltip.get()}}</md-tooltip> \
                                                                    <md-icon class="material-icons">history</md-icon> \
                                                                </md-button> \
                                                            </div> \
                                                        </div> \
                                                    </md-toolbar> \
                                                    <form name="bindCtrl.entityForm" novalidate ng-submit="bindCtrl.entityForm.$valid && bindCtrl.submit()" autocomplete="off"> \
                                                        <md-dialog-content> \
                                                            <md-content layout-padding> \
                                                                <div compile="bindCtrl.stringhtmlcomponent" flex="100"></div> \
                                                            </md-content> \
                                                        </md-dialog-content> \
                                                        <md-dialog-actions layout="row" ng-if="bindCtrl.allowActions.get()"> \
                                                            <md-button md-colors="{background: \'default-primary-50\'}" ng-show="bindCtrl.canCancel.get()" ng-click="bindCtrl.cancel()" ng-disabled="bindCtrl.onTask.get()" ng-href="{{bindCtrl.cancelHref.get()}}"> \
                                                                <md-icon class="material-icons">{{bindCtrl.cancelIcon.get()}}</md-icon>&nbsp;{{bindCtrl.cancelText.get()}} \
                                                            </md-button> \
                                                            <md-button class="md-warn" ng-show="bindCtrl.canRemove.get()" ng-click="bindCtrl.remove()" ng-disabled="bindCtrl.onTask.get()" ng-href="{{bindCtrl.removeHref.get()}}"> \
                                                                <md-icon class="material-icons">{{bindCtrl.removeIcon.get()}}</md-icon>&nbsp;{{bindCtrl.removeText.get()}} \
                                                            </md-button> \
                                                            <md-button type="submit" class="md-primary" ng-show="bindCtrl.canSave.get()" ng-disabled="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid"> \
                                                                <md-tooltip ng-if="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid">{{bindCtrl.saveTooltip.get()}}</md-tooltip> \
                                                                <md-icon class="material-icons">{{bindCtrl.saveIcon.get()}}</md-icon>&nbsp;{{bindCtrl.saveText.get()}} \
                                                            </md-button> \
                                                            <md-button class="md-accent" ng-show="bindCtrl.canEdit.get()" ng-click="bindCtrl.edit()" ng-disabled="bindCtrl.onTask.get()" ng-href="{{bindCtrl.editHref.get()}}"> \
                                                                <md-icon class="material-icons">{{bindCtrl.editIcon.get()}}</md-icon>&nbsp;{{bindCtrl.editText.get()}} \
                                                            </md-button> \
                                                            <md-button md-colors="{background: \'default-primary-50\'}" ng-show="bindCtrl.canOk.get()" ng-click="bindCtrl.ok()" ng-disabled="bindCtrl.onTask.get()" ng-href="{{bindCtrl.okHref.get()}}"> \
                                                                <md-icon class="material-icons">{{bindCtrl.okIcon.get()}}</md-icon>&nbsp;{{bindCtrl.okText.get()}} \
                                                            </md-button> \
                                                            <md-button class="md-primary" ng-show="bindCtrl.canProcess.get()" ng-click="bindCtrl.process()" ng-disabled="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid"> \
                                                                <md-tooltip ng-if="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid">{{bindCtrl.saveTooltip.get()}}</md-tooltip> \
                                                                <md-icon class="material-icons">{{bindCtrl.processIcon.get()}}</md-icon>&nbsp;{{bindCtrl.processText.get()}} \
                                                            </md-button> \
                                                        </md-dialog-actions> \
                                                    </form> \
                                                </md-dialog>',
                                    controller: 'EntifixEntityModalController',
                                    parent: angular.element(document.body),
                                    targetEvent: event,
                                    clickOutsideToClose: clickOutsideToClose,
                                    escapeToClose: escapeToClose,
                                    fullscreen: fullscreen,
                                    controllerAs: 'bindCtrl',
                                    multiple: true,
                                    locals: {
                                                componentConstruction: () => { return componentConstruction; },
                                                componentBehavior: () => { return componentBehavior; },
                                                componentBindingOut: () => { return componentBindingOut; },
                                                queryDetails: () => { return queryDetails; },
                                            }
                                    })
                .then(function (results)
                    {
                        if (callback)
                            callback(results);
                    },
                    function ()
                    {
                        
                    });
            };

            //==============================================================================================================================================================================

        };

        return entityModal;
    };

})();