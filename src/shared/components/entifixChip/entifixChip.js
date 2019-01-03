(function () {
    'use strict';
   
    function componentcontroller($mdConstant)
    {
        var vm = this;
        var randomNumber = Math.floor((Math.random() * 100) + 1);
        vm.separatorsDefault = [$mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.ENTER];

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
        vm.maxChips =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.maxChips)
                    return vm.componentConstruction.maxChips;

                //Default value
                return null;
            }
        };
        
        vm.maxChipsMessage =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.maxChipsMessage)
                {
                    if (vm.componentConstruction.maxChipsMessage.getter)
                        return vm.componentConstruction.maxChipsMessage.getter();
                    
                    if (vm.componentConstruction.maxChipsMessage.text)
                        return vm.componentConstruction.maxChipsMessage.text;
                }

                //Default value
                return 'Ha alcanzado el número máximo de elementos';
            }
        };
         
        vm.name = 
        {
            get: () =>
            {
                return 'entifixchip' + randomNumber;
            }
        };
        
        vm.transformChip = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.transformChip)
                    return vm.componentConstruction.transformChip;

                //Default value
                return null;
            },

            invoke: (chip, index) =>
            {
                if (vm.componentConstruction && vm.componentConstruction.transformChip)
                    vm.componentConstruction.transformChip(chip, index);
            }
        };
         
        vm.onAdd = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.onAdd)
                    return vm.componentConstruction.onAdd;

                //Default value
                return null;
            },

            invoke: (chip, index) =>
            {
                if (vm.componentConstruction && vm.componentConstruction.onAdd)
                    vm.componentConstruction.onAdd(chip, index);
            }
        };
         
        vm.onRemove = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.onRemove)
                    return vm.componentConstruction.onRemove;

                //Default value
                return null;
            },

            invoke: (chip, index) =>
            {
                if (vm.componentConstruction && vm.componentConstruction.onRemove)
                    vm.componentConstruction.onRemove(chip, index);
            }
        };
         
        vm.onSelect = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.onSelect)
                    return vm.componentConstruction.onSelect;

                //Default value
                return null;
            },

            invoke: (chip, index) =>
            {
                if (vm.componentConstruction && vm.componentConstruction.onSelect)
                    vm.componentConstruction.onSelect(chip, index);
            }
        };
         
        vm.placeholder = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.placeholder)
                    return vm.componentConstruction.placeholder;

                //Default value
                return '';
            }
        };
         
        vm.secondaryPlaceholder = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.secondaryPlaceholder)
                    return vm.componentConstruction.secondaryPlaceholder;

                //Default value
                return vm.placeholder.get();
            }
        };
        
        vm.isForm =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.isForm != null)
                    return vm.componentConstruction.isForm;

                //Default value
                return true;
            }
        };
        
        vm.removable =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.removable != null)
                    return vm.componentConstruction.removable;

                //Default value
                return true;
            }
        };
        
        vm.readOnly =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.readOnly)
                    return vm.componentConstruction.readOnly;

                //Default value
                return false;
            }
        };
        
        vm.enableChipEdit =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.enableChipEdit != null)
                    return vm.componentConstruction.enableChipEdit;

                //Default value
                return 'true';
            }
        };
        
        vm.addOnBlur =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.addOnBlur != null)
                    return vm.componentConstruction.addOnBlur;

                //Default value
                return true;
            }
        };
        
        vm.separators =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.separators)
                    return vm.componentConstruction.separators;

                //Default value
                return vm.separatorsDefault;
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
        //=======================================================================================================================================================================



        //Methods________________________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.$onInit = function()
        {
            if (vm.init)
                vm.init();
        };

        function getCleanedString(stringToClean){
            var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

            for (var i = 0; i < specialChars.length; i++) 
                stringToClean= stringToClean.replace(new RegExp("\\" + specialChars[i], 'gi'), '');

            stringToClean = stringToClean.toLowerCase();
            stringToClean = stringToClean.replace(/ /g,"");
            stringToClean = stringToClean.replace(/á/gi,"a");
            stringToClean = stringToClean.replace(/é/gi,"e");
            stringToClean = stringToClean.replace(/í/gi,"i");
            stringToClean = stringToClean.replace(/ó/gi,"o");
            stringToClean = stringToClean.replace(/ú/gi,"u");
            stringToClean = stringToClean.replace(/ñ/gi,"n");
            return stringToClean;
        }

        vm.getStringValue = function()
        {
            if (Array.isArray(vm.valueModel) && vm.valueModel.length > 0)
            {
                var value = '';
                vm.valueModel.forEach((element) => { value += element + ' '; });
                return value;
            }
            return '';
        }

        vm.tC = function(chip, index)
        {
            if (vm.transformChip.get())
                vm.transformChip.invoke(chip, index);
        }

        vm.oAdd = function(chip, index)
        {
            if (vm.onAdd.get())
                vm.onAdd.invoke(chip, index);
        }

        vm.oRemove = function(chip, index)
        {
            if (vm.onRemove.get())
                vm.onRemove.invoke(chip, index);
        }

        vm.oSelect = function(chip, index)
        {
            if (vm.onSelect.get())
                vm.onSelect.invoke(chip, index);
        }
 
        //=======================================================================================================================================================================


        
    };

    componentcontroller.$inject = ['$mdConstant'];

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
        //templateUrl: 'src/shared/components/entifixChip/entifixChip.html',
        template: '<md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                    <div ng-if="vm.isForm.get()"> \
                        <md-chips \
                            ng-if="vm.canShowEditableFields.get()" \
                            name="{{vm.name.get()}}" \
                            ng-model="vm.valueModel" \
                            md-transform-chip="vm.tC($chip, $index)" \
                            placeholder="{{vm.placeholder.get()}}" \
                            secondary-placeholder="{{vm.secondaryPlaceholder.get()}}" \
                            md-removable="vm.removable.get()" \
                            readonly="vm.readOnly.get()" \
                            md-enable-chip-edit="{{vm.enableChipEdit.get()}}" \
                            md-max-chips="{{vm.maxChips.get()}}" \
                            md-add-on-blur="{{vm.addOnBlur.get()}}" \
                            md-on-add="vm.oAdd$chip()" \
                            md-on-remove="vm.oRemove($chip, $index)" \
                            md-on-select="vm.oSelect($chip, $index)" \
                            md-separator-keys="vm.separators.get()"> \
                            <md-chip-template> \
                                {{$chip}} \
                                &nbsp&nbsp \
                                </md-chip-template> \
                        </md-chips> \
                        <div ng-messages="vm.canEvaluateErrors.get()" class="ngMessage-error" multiple> \
                            <div ng-message="md-max-chips">{{vm.maxChipsMessage.get()}}</div> \
                        </div> \
                        <div ng-if="!vm.canShowEditableFields.get()"> \
                            <label>{{vm.placeholder.get()}}</label><br/> \
                            <strong>{{vm.getStringValue()}}</strong> \
                        </div> \
                    </div> \
                    <div ng-if="!vm.isForm.get()"> \
                        <md-chips \
                            name="{{vm.name.get()}}" \
                            ng-model="vm.valueModel" \
                            md-transform-chip="vm.tC($chip, $index)" \
                            placeholder="{{vm.placeholder.get()}}" \
                            secondary-placeholder="{{vm.secondaryPlaceholder.get()}}" \
                            md-removable="vm.removable.get()" \
                            readonly="vm.readOnly.get()" \
                            md-enable-chip-edit="{{vm.enableChipEdit.get()}}" \
                            md-max-chips="{{vm.maxChips.get()}}" \
                            md-add-on-blur="{{vm.addOnBlur.get()}}" \
                            md-on-add="vm.oAdd($chip, $index)" \
                            md-on-remove="vm.oRemove($chip, $index)" \
                            md-on-select="vm.oSelect($chip, $index)" \
                            md-separator-keys="vm.separators.get()"> \
                            <md-chip-template> \
                                {{$chip}} \
                                &nbsp&nbsp \
                                </md-chip-template> \
                        </md-chips> \
                        <div ng-messages="vm.canEvaluateErrors.get()" class="ngMessage-error" multiple> \
                            <div ng-message="md-max-chips">{{vm.maxChipsMessage.get()}}</div> \
                        </div> \
                    </div> \
                    <br/>',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixChip', component);

})();