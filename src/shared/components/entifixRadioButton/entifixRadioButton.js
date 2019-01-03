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

        //Label - Editable Behavior
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
                if (getCleanedString(vm.title.get()) != '')
                    return getCleanedString(vm.title.get())
                return 'entifixradiobutton' + randomNumber;
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
            loadCollection();
            checkoutputs();
        };
        
        function loadCollection ()
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
            if (vm.valueModel && vm.items && vm.items.length > 0)
            {
                var item = vm.items.filter((e)=>{return e.Value == vm.valueModel;})[0]
                if (item)
                    return item.Display;
            }

            return null;            
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
 
        //=======================================================================================================================================================================

    };

    componentcontroller.$inject = [];

    var component = 
    {
        bindings: 
        {
            valueModel: '=',
            showEditableFields: '=',
            evaluateErrors: '&',
            queryDetails: '<',
            componentConstruction: '<',
            componentBindingOut: '=',
            onChange: '&'
        },
        //templateUrl: 'src/shared/components/entifixRadioButton/entifixRadioButton.html',
        template: '<div ng-class="{\'whirl double-up whirlback\': vm.isLoading.get()}"> \
                    <md-tooltip ng-if="vm.tooltip.get()" md-direction="left">{{vm.tooltip.get()}}</md-tooltip> \
                    <div ng-if="vm.isForm.get()"> \
                        <div ng-if="vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}</label> \
                            <md-radio-group \
                                ng-model="vm.valueModel" \
                                ng-required="vm.isRequired.get()" \
                                ng-change="vm.runOnChangeTrigger()" \
                                name="{{vm.name.get()}}"> \
                                <md-radio-button \
                                    ng-repeat="item in vm.items" \
                                    ng-value="item.Value" \
                                    aria-label="item.Display"> \
                                    {{item.Display}} \
                                </md-radio-button> \
                                <div ng-messages="vm.canEvaluateErrors.get()" class="ngMessage-error" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                </div>  \
                            </md-radio-group> \
                        </div> \
                        <div ng-if="!vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}</label><br/> \
                            <strong>{{vm.getDisplayValue()}}</strong> \
                        </div> \
                    </div> \
                    <div ng-if="!vm.isForm.get()"> \
                        <div ng-if="vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}</label> \
                            <md-radio-group \
                                ng-model="vm.valueModel" \
                                ng-required="vm.isRequired.get()" \
                                ng-change="vm.runOnChangeTrigger()" \
                                name="{{vm.name.get()}}"> \
                                <md-radio-button \
                                    ng-repeat="item in vm.items" \
                                    ng-value="item.Value" \
                                    aria-label="item.Display"> \
                                    {{item.Display}} \
                                </md-radio-button> \
                                <div ng-messages="vm.canEvaluateErrors.get()" class="ngMessage-error" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.get()}}</div> \
                                </div>  \
                            </md-radio-group> \
                        </div> \
                        <div ng-if="!vm.canShowEditableFields.get()"> \
                            <label>{{vm.title.get()}}</label><br/> \
                            <strong>{{vm.getDisplayValue()}}</strong> \
                        </div> \
                    </div> \
                </div>',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixRadioButton', component);

})();