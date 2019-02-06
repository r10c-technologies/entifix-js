(function () {
    'use strict';
   
    function componentcontroller(EntifixStringUtils)
    {
        var vm = this;
        var randomNumber = Math.floor((Math.random() * 100) + 1);

        //Fields and Properties__________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================
        //Label - Input Behavior
        vm.canShowEditableFields =
        {
            get: () =>
            {
                if (vm.showEditableFields)
                    return vm.showEditableFields;

                return false;
            }
        };

        //Error Behavior with ng-messages
        vm.canEvaluateErrors =
        {
            get: () =>
            {
                if (vm.evaluateErrors)
                    return vm.evaluateErrors( { name: vm.name.get() } );

                return false;
            }
        };
        
        //Error validations
        vm.isRequired =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.isRequired)
                    return vm.componentConstruction.isRequired;

                //Default value
                return false;
            }
        };
        
        vm.requiredMessage =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.requiredMessage)
                {
                    if (vm.componentConstruction.requiredMessage.getter)
                        return vm.componentConstruction.requiredMessage.getter();
                    
                    if (vm.componentConstruction.requiredMessage.text)
                        return vm.componentConstruction.requiredMessage.text;
                }

                //Default value
                return 'Este campo es obligatorio';
            }
        };

        vm.title = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.title)
                {
                    if (vm.componentConstruction.title.getter)
                        return vm.componentConstruction.title.getter();
                    
                    if (vm.componentConstruction.title.text)
                        return vm.componentConstruction.title.text;
                }

                //Default value
                return '';
            }
        };
         
        vm.name = 
        {
            get: () =>
            {
                if (EntifixStringUtils.getCleanedString(vm.title.get()) != '')
                    return EntifixStringUtils.getCleanedString(vm.title.get());
                return 'entifixinput' + randomNumber;
            }
        };

        vm.tooltip = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.tooltip)
                {
                    if (vm.componentConstruction.tooltip.getter)
                        return vm.componentConstruction.tooltip.getter();
                    
                    if (vm.componentConstruction.tooltip.text)
                        return vm.componentConstruction.tooltip.text;
                }

                //Default value
                return null;
            }
        };
        
        vm.isMultiple =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.isMultiple != null)
                    return vm.componentConstruction.isMultiple;

                //Default value
                return false;
            }
        };
        
        vm.selectFileText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.selectFileText)
                {
                    if (vm.componentConstruction.selectFileText.getter)
                        return vm.componentConstruction.selectFileText.getter();
                    
                    if (vm.componentConstruction.selectFileText.text)
                        return vm.componentConstruction.selectFileText.text;
                }

                //Default value
                if (vm.isMultiple.get())
                    return 'Seleccionar Archivos...';
                return 'Seleccionar Archivo';
            }
        };
        
        vm.deleteFileLabel =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.deleteFileLabel)
                {
                    if (vm.componentConstruction.deleteFileLabel.getter)
                        return vm.componentConstruction.deleteFileLabel.getter();
                    
                    if (vm.componentConstruction.deleteFileLabel.text)
                        return vm.componentConstruction.deleteFileLabel.text;
                }

                //Default value
                if (vm.isMultiple.get())
                    return 'Eliminar archivos...';
                return 'Eliminar archivo...';
            }
        };
        
        vm.fileNameLabel =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.fileNameLabel)
                {
                    if (vm.componentConstruction.fileNameLabel.getter)
                        return vm.componentConstruction.fileNameLabel.getter();
                    
                    if (vm.componentConstruction.fileNameLabel.text)
                        return vm.componentConstruction.fileNameLabel.text;
                }

                //Default value
                if (vm.isMultiple.get())
                    return 'Nombre de los archivos: ';
                return 'Nombre del archivo: ';
            }
        };
        
        vm.showSelectedMessage =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.showSelectedMessage != null)
                    return vm.componentConstruction.showSelectedMessage;

                //Default value
                return true;
            }
        };
        //=======================================================================================================================================================================



        //Methods________________________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.$onInit = function()
        {
            if (vm.init)
                vm.init();
        };

        vm.runOnChangeTrigger = function()
        {
            if (vm.onChange)
                vm.onChange({ value: vm.valueModel });
        }

        vm.getDisplay = function()
        {
            if (vm.valueModel)
            {
                if (vm.format.get())
                    return $filter(vm.format.get())(vm.valueModel, vm.currency.get());
                return vm.valueModel;
            }
            else
                return vm.nullValueLabel.get();
        }

        vm.cleanFile = function()
        {
            delete vm.valueModel;
        }
 
        //=======================================================================================================================================================================
    };

    componentcontroller.$inject = ['EntifixStringUtils'];

    var component = 
    {
        bindings: 
        {
            valueModel: '=',
            showEditableFields: '=',
            evaluateErrors: '&',
            componentConstruction: '<',
            onChange: '&'
        },
        //templateUrl: 'src/shared/components/entifixFile/entifixFile.html',
        template: '<div ng-show="vm.canShowEditableFields.get()"> \
                    <md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                    <div ng-if="!vm.isMultiple.get()"> \
                        <label class="btn-file md-raised md-primary">{{vm.selectFileText.get()}} \
                            <input type="file" \
                                ng-model="vm.valueModel" \
                                ng-required="vm.isRequired.get()" \
                                entifix-file-read \
                                ng-change="vm.runOnChangeTrigger()"/> \
                        </label> \
                        <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                            <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                        </div> \
                        <md-button class="text-danger btn-delete-file" ng-click="vm.cleanFile()" ng-show="vm.valueModel">{{vm.deleteFileLabel.get()}}</md-button> \
                        <h4 ng-show="vm.valueModel && vm.showSelectedMessage.get()"> \
                            <strong>{{vm.fileNameLabel.get()}}</strong> \
                            {{vm.valueModel.name + " "}} \
                        </h4> \
                    </div> \
                    <div ng-if="vm.isMultiple.get()"> \
                        <label class="btn-file md-raised md-primary">{{vm.selectFileText.get()}} \
                            <input type="file" \
                                ng-model="vm.valueModel" \
                                multiple \
                                ng-required="vm.isRequired.get()" \
                                entifix-file-read \
                                ng-change="vm.runOnChangeTrigger()"/> \
                        </label> \
                        <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                            <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                        </div> \
                        <md-button class="text-danger btn-delete-file" ng-click="vm.cleanFile()" ng-show="vm.valueModel">{{vm.deleteFileLabel.get()}}</md-button> \
                        <h4 ng-show="vm.valueModel && vm.showSelectedMessage.get()"> \
                            <strong>{{vm.fileNameLabel.get()}}</strong> \
                            <p ng-repeat="file in vm.valueModel">{{file.name + " "}}</p> \
                        </h4> \
                    </div> \
                    <br hide-gt-sm><br hide-gt-sm> \
                   </div>',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixFile', component);

})();