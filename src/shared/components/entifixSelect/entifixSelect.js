(function () {
    'use strict';
   
    function componentcontroller()
    {
        var vm = this;
        var randomNumber = Math.floor((Math.random() * 100) + 1);

        //Fields and Properties__________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.isLoading =
        {
            get: () =>
            {
                if (vm.queryDetails && vm.queryDetails.resource)
                    vm.queryDetails.resource.isLoading.get();

                //Default value
                return false;
            }
        };

        //Label - Input Behavior
        vm.canShowEditableFields =
        {
            get: () =>
            {
                if (vm.showEditableFields)
                    return vm.showEditableFields();

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
        
        vm.multipleMessage =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.multipleMessage)
                {
                    if (vm.componentConstruction.multipleMessage.getter)
                        return vm.componentConstruction.multipleMessage.getter();
                    
                    if (vm.componentConstruction.multipleMessage.text)
                        return vm.componentConstruction.multipleMessage.text;
                }

                //Default value
                return 'Error en la elección del elemento, vuelva a seleccionarlo';
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
                if (getCleanedString(vm.title.get()) != '')
                    return getCleanedString(vm.title.get())
                return 'entifixselect' + randomNumber;
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
        
        vm.isMultipleDisplay =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.isMultipleDisplay)
                    return vm.componentConstruction.isMultipleDisplay;

                //Default value
                return false;
            }
        };
        
        vm.isMultiple =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.isMultiple)
                    return vm.componentConstruction.isMultiple;

                //Default value
                return false;
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

        vm.collection =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.collection)
                {
                    if (vm.componentConstruction.collection.getter)
                        return vm.componentConstruction.collection.getter();
                    if (vm.componentConstruction.collection.elements)
                        return vm.componentConstruction.collection.elements;
                }

                //Default value
                return null;
            }
        }

        vm.nullValueLabel =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.nullValueLabel)
                    return vm.componentConstruction.nullValueLabel;
                
                return 'SIN REGISTROS';
            }
        }
        //=======================================================================================================================================================================



        //Methods________________________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.$onInit = function()
        {
            loadCollection();
            checkoutputs();
            vm.searchText;
        };
       
        
        function loadCollection ()
        {
            if (vm.collection.get())
                vm.items = vm.collection.get();
            else 
            {
                if (!vm.isMultipleDisplay.get())
                {
                    vm.queryDetails
                        .resource
                        .getEnumerationBind(vm.componentConstruction.displayPropertyName, 
                                                (enumResult) => 
                                                { 
                                                    vm.items = enumResult; 
                                                });
                }
                else
                {
                    prepareMultiDisplayParameters();
                    vm.queryDetails.resource.getEnumerationBindMultiDisplay(vm.parameters);
                }
            }
        };

        function prepareMultiDisplayParameters()
        {
            var actionSuccess = (enumResult) => 
                                            { 
                                                vm.items = enumResult; 
                                            };
            vm.parameters = {
                displayProperties: vm.componentConstruction.displayProperties,
                actionSuccess: actionSuccess,
                actionError: vm.queryDetails.actionError,
                filters: vm.queryDetails.filters
            };
        }

        function checkoutputs()
        {
            vm.componentBindingOut = 
            { 
                selectedEntity:
                {
                    get: () => { return vm.getValue() }
                }
            };

            if (vm.init)
                vm.init();
        };

        vm.getDisplayValue = function()
        {
            if (!vm.isMultiple.get())
            {
                if (vm.valueModel && vm.items && vm.items.length > 0)
                {
                    var item = vm.items.filter((e)=>{return e.Value == vm.valueModel;})[0];
                    if (item)
                        return item.Display;
                }
            }
            else
            {
                if (vm.valueModel && vm.items && vm.items.length > 0)
                {
                    var item = '';
                    vm.valueModel.forEach((valueModel) => { item += vm.items.filter((e)=>{return e.Value == valueModel;})[0].Display; });
                    if (item)
                        return item;
                }
            }
            return vm.nullValueLabel.get();            
        };

        vm.getValue = function()
        {
            if (vm.valueModel && vm.items && vm.items.length > 0)
            {
                var item = vm.items.filter((e)=>{return e.Value == vm.valueModel;})[0]
                if (item)
                    return item;
            }

            return null;            
        };

        vm.runOnChangeTrigger = function()
        {
            var entity = vm.items.filter((e)=>{return e.Value == vm.valueModel;})[0]
            if (vm.onChange)
                vm.onChange({oldValue: vm.valueModel, newValue: vm.valueModel, entity: entity});
        }

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

        vm.cleanSearch = function()
        {
            vm.searchText = '';
        }
 
        //=======================================================================================================================================================================


        
    };

    componentcontroller.$inject = [];

    var component = 
    {
        bindings: 
        {
            valueModel: '=',
            showEditableFields: '&',
            evaluateErrors: '&',
            queryDetails: '<',
            componentConstruction: '<',
            componentBindingOut: '=',
            onChange: '&'
        },
        templateUrl: 'src/shared/components/entifixSelect/entifixSelect.html',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixSelect', component);

})();