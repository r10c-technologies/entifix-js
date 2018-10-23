
(function(){
    'use strict';

    var module = angular.module('entifix-js');

    componentController.$inject = ['BaseComponentFunctions', 'EntifixNotification', 'EntifixNotifier', '$timeout', '$rootScope'];

    function componentController(BaseComponentFunctions, EntifixNotification, EntifixNotifier, $timeout, $rootScope)
    {
        var vm = this;

        // Properties & Fields ===================================================================================================================================================
        
        //Fields
        var _isloading = false;
        var _notifier = null;
        
        var _statesForm = 
        {
            edit: 1,
            view: 2    
        }; 

        var _state = _statesForm.view;

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

        vm.title = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.title)
                {
                    if (vm.componentConstruction.title.getter)
                        return vm.componentConstruction.title.getter(vm.entity.get());
                    
                    if (vm.componentConstruction.title.text)
                        return vm.componentConstruction.title.text;
                }

                //Default value
                return 'Detalle';
            }
        };

        vm.icon =
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.title)
                {   
                    if (vm.componentConstruction.title.icon)
                        return vm.componentConstruction.title.icon;
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
                if (vm.componentConstruction && vm.componentConstruction.cancel && _state == _statesForm.edit)
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
                if (vm.componentConstruction && vm.componentConstruction.cancel &&  vm.componentConstruction.cancel.text)
                    return '' + vm.componentConstruction.cancel.text;

                //Default value
                return 'Cancelar';
            } 
        };

        // ok button
        vm.canOk = 
        {            
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.ok && _state == _statesForm.view)
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
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.queryDetails && vm.queryDetails.resource && vm.entity.get() && !vm.queryDetails.resource.isNewEntity(vm.entity.get()) && _state == _statesForm.view)
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
                    else if (vm.componentConstruction.edit.text instanceof String)
                        return vm.componentConstruction.edit.text;
                };

                //Default value
                return 'Editar';
            } 
        };


        // save button
        vm.canSave = 
        {            
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.save && _state == _statesForm.edit)
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
                if (vm.componentConstruction && vm.componentConstruction.save &&  vm.componentConstruction.save.text)
                    return '' + vm.componentConstruction.save.text;

                //Default value
                return 'Guardar';
            } 
        };


        // remove button
        vm.canRemove = 
        {            
            get: () =>
            {                
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.queryDetails && vm.queryDetails.resource && vm.entity.get() && !vm.queryDetails.resource.isNewEntity(vm.entity.get()) && _state == _statesForm.edit)
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
                if (vm.componentConstruction && vm.componentConstruction.remove &&  vm.componentConstruction.remove.text)
                    return '' + vm.componentConstruction.remove.text;

                //Default value
                return 'Eliminar';
            } 
        };

        //process icon
        vm.canProcess = 
        {            
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.process && _state == _statesForm.view && vm.queryDetails && vm.queryDetails.resource && vm.entity.get() && !vm.queryDetails.resource.isNewEntity(vm.entity.get()) && !vm.queryDetails.resource.isProcessedEntity(vm.entity.get()))
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

        vm.canViewHistory = 
        {
            get: () =>
            {
                return vm.componentConstruction.canViewHistory.get();
            },

            set: (value) =>
            {
                vm.componentConstruction.canViewHistory.set(value);
            }
        }

        vm.history =
        {
            get: () => { return $rootScope.showHistory; }
        };

        // =======================================================================================================================================================================
        
        // Methods ===============================================================================================================================================================

        vm.$onInit = function()
        {
            setdefaults();
            createconnectioncomponent();
            activate();

            checkoutputs();
        };

        function setdefaults()
        {
            _notifier = new EntifixNotifier(vm.queryDetails.resource);           
        };

        function createconnectioncomponent()
        {            
            vm.connectionComponent = { };                   

            // Connection Component Properties __________________________________________________________________________________________
            // ==========================================================================================================================

            vm.connectionComponent.showEditableFields =
            {
                get: () =>
                {
                    if (vm.entity.get()) return (_state == _statesForm.edit); else return true;
                },
                set: (value) =>
                {
                    if (value == true)
                        _state = _statesForm.edit;
                    if (value == false)
                        _state = _statesForm.view;
                }
            };

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
                    {
                        propertyValue.forEach((element) => { if (element.$name == property) errors[error] = true; });

                        //((element) => { 
                        //    if (element.$name == property)
                        //        errors[error] = true;
                        //})(...propertyValue);
                    }
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

        function activate()
        {   
             if (vm.componentConstruction)
                createDynamicComponent();
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

        vm.ok = function()
        {            
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onOk)
                vm.componentBehavior.events.onOk();
            
            if (vm.componentConstruction.ok.customAction)
                vm.componentConstruction.ok.customAction();
            else
                defaultOk();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onAfterOk)
                vm.componentBehavior.events.onAfterOk();
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

        vm.edit = function()
        {            
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onEdit)
                vm.componentBehavior.events.onEdit();
            
            if (vm.componentConstruction.edit.customAction)
                vm.componentConstruction.edit.customAction();
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
                vm.componentConstruction.save.customAction(vm.entity.get(), setViewState);
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
                vm.componentConstruction.remove.customAction(vm.entity.get());
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
                vm.componentConstruction.process.customAction(vm.entity.get(), setViewState);
            else
                defaultProcess();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onProcessed)
                vm.componentBehavior.events.onProcessed();
        };

        function defaultOk()
        {
            
        };

        function defaultCancel()
        {
            if (_state == _statesForm.edit)
            {
                _state = _statesForm.view;                
                reloadEntity();
            }   
        };

        function defaultEdit()
        {
            _state = _statesForm.edit;
        };

        function defaultSave()
        {
            vm.queryDetails.resource.saveEntity(vm.connectionComponent.entity,  (response, saveSuccess) => 
                                                                                {                                                                                     
                                                                                    if (saveSuccess)
                                                                                        _state = _statesForm.view;
                                                                                    if (response && response.data.data)
                                                                                        vm.entity.set(response.data.data);
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
                                        vm.queryDetails.resource.deleteEntity(vm.connectionComponent.entity, () => { _state = _statesForm.view; });
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
        
        function setViewState(view, entity)
        {
            if (view)
                _state = _statesForm.view;
            else
                _state = _statesForm.edit;

            vm.entity.set(entity);
        }

        // =======================================================================================================================================================================
        
    };

    var component =
    {
        //templateUrl: 'src/shared/components/entifixEntityForm/entifixEntityForm.html',
        template: '<br/> \
                    <md-card md-whiteframe="4" ng-class="{\'whirl double-up whirlback\': bindCtrl.onTask.get() }"> \
                        <md-card-title> \
                            <md-card-title-text> \
                                <span class="md-headline"><md-icon class="material-icons">{{bindCtrl.icon.get()}}</md-icon>&nbsp;{{bindCtrl.title.get()}}</span> \
                            </md-card-title-text> \
                        </md-card-title> \
                        <form name="bindCtrl.entityForm" novalidate ng-submit="bindCtrl.entityForm.$valid && bindCtrl.submit()" autocomplete="off"> \
                            <md-card-content> \
                                <div compile="bindCtrl.stringhtmlcomponent" flex="100"></div> \
                            </md-card-content> \
                            <md-card-actions layout="row" layout-align="end center" ng-if="bindCtrl.allowActions.get()"> \
                                <md-button md-colors="{background: \'default-primary-50\'}" ng-show="bindCtrl.canCancel.get()" ng-click="bindCtrl.cancel()" ng-disabled="bindCtrl.onTask.get()"> \
                                    <md-icon class="material-icons">{{bindCtrl.cancelIcon.get()}}</md-icon> &nbsp;{{bindCtrl.cancelText.get()}} \
                                </md-button> \
                                <md-button class="md-warn" ng-show="bindCtrl.canRemove.get()" ng-click="bindCtrl.remove()" ng-disabled="bindCtrl.onTask.get()"> \
                                    <md-icon class="material-icons">{{bindCtrl.removeIcon.get()}}</md-icon> &nbsp;{{bindCtrl.removeText.get()}} \
                                </md-button> \
                                <md-button type="submit" class="md-primary" ng-show="bindCtrl.canSave.get()" ng-disabled="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid"> \
                                    <md-tooltip ng-if="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid">{{bindCtrl.saveTooltip.get()}}</md-tooltip> \
                                    <md-icon class="material-icons">{{bindCtrl.saveIcon.get()}}</md-icon> &nbsp;{{bindCtrl.saveText.get()}} \
                                </md-button> \
                                <md-button class="md-accent" ng-show="bindCtrl.canEdit.get()" ng-click="bindCtrl.edit()" ng-disabled="bindCtrl.onTask.get()"> \
                                    <md-icon class="material-icons">{{bindCtrl.editIcon.get()}}</md-icon> &nbsp;{{bindCtrl.editText.get()}} \
                                </md-button> \
                                <md-button md-colors="{background: \'default-primary-50\'}" ng-show="bindCtrl.canOk.get()" ng-click="bindCtrl.ok()" ng-disabled="bindCtrl.onTask.get()"> \
                                    <md-icon class="material-icons">{{bindCtrl.okIcon.get()}}</md-icon> &nbsp;{{bindCtrl.okText.get()}} \
                                </md-button> \
                                <md-button class="md-primary" ng-show="bindCtrl.canProcess.get()" ng-click="bindCtrl.process()" ng-disabled="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid || !bindCtrl.isValidEntity.get()"> \
                                    <md-tooltip ng-if="bindCtrl.onTask.get() || !bindCtrl.entityForm.$valid">{{bindCtrl.saveTooltip.get()}}</md-tooltip> \
                                    <md-icon class="material-icons">{{bindCtrl.processIcon.get()}}</md-icon> &nbsp;{{bindCtrl.processText.get()}} \
                                </md-button> \
                            </md-card-actions> \
                        </form> \
                    </md-card>',
        controller: componentController,
        controllerAs: 'bindCtrl',
        bindings:
        {
            componentConstruction: '<',
            componentBehavior: '<',
            componentBindingOut: '=',
            queryDetails: '='
        }
    }

    //Register component
    module.component('entifixEntityForm', component);
})();