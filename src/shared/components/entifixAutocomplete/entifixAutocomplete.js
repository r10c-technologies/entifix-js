(function () {
    'use strict';
   
    function componentcontroller($timeout, EntifixStringUtils, $scope)
    {
        var vm = this;
        var randomNumber = Math.floor((Math.random() * 100) + 1);
        var _defaultTitle, plannedRecharge;

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
        
        vm.requiredMatch =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.requiredMatch != null)
                    return vm.componentConstruction.requiredMatch;

                //Default value
                return true;
            }
        };
        
        vm.requiredMatchMessage =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.requiredMatchMessage)
                {
                    if (vm.componentConstruction.requiredMatchMessage.getter)
                        return vm.componentConstruction.requiredMatchMessage.getter();
                    
                    if (vm.componentConstruction.requiredMatchMessage.text)
                        return vm.componentConstruction.requiredMatchMessage.text;
                }

                //Default value
                return 'Seleccione un elemento de la lista';
            }
        };
        
        vm.minLengthRequest =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.minLengthRequest)
                    return vm.componentConstruction.minLengthRequest;

                //Default value
                return 0;
            }
        };
        
        vm.minLength =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.minLength)
                    return vm.componentConstruction.minLength;

                //Default value
                return null;
            }
        };
        
        vm.minLengthMessage =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.minLengthMessage)
                {
                    if (vm.componentConstruction.minLengthMessage.getter)
                        return vm.componentConstruction.minLengthMessage.getter();
                    
                    if (vm.componentConstruction.minLengthMessage.text)
                        return vm.componentConstruction.minLengthMessage.text;
                }

                //Default value
                return 'El texto es demasiado corto';
            }
        };
        
        vm.maxLength =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.maxLength)
                    return vm.componentConstruction.maxLength;

                //Default value
                return null;
            }
        };
        
        vm.maxLengthMessage =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.maxLengthMessage)
                {
                    if (vm.componentConstruction.maxLengthMessage.getter)
                        return vm.componentConstruction.maxLengthMessage.getter();
                    
                    if (vm.componentConstruction.maxLengthMessage.text)
                        return vm.componentConstruction.maxLengthMessage.text;
                }

                //Default value
                return 'El texto es demasiado largo';
            }
        };
        
        vm.createNewEntityMessage =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.createNewEntityMessage)
                {
                    if (vm.componentConstruction.createNewEntityMessage.getter)
                        return vm.componentConstruction.createNewEntityMessage.getter();
                    
                    if (vm.componentConstruction.createNewEntityMessage.text)
                        return vm.componentConstruction.createNewEntityMessage.text;
                }

                //Default value
                return 'Agregar ';
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
            },

            set: (value) =>
            {
                if (value)
                    vm.componentConstruction.title = { text: value }
            }
        };
  
        vm.name = 
        {
            get: () =>
            {
                if (vm.title.get() != '')
                    return EntifixStringUtils.getCleanedString(vm.title.get())
                return 'entifixautocomplete' + randomNumber;
            }
        };

        vm.mappingMethod = 
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.mapping)
                {
                    if (vm.componentConstruction.mapping.method)
                        return vm.componentConstruction.mapping.method;
                    if (vm.componentConstruction.mapping.property)
                        return (element) => { return element[vm.componentConstruction.mapping.property]; }
                }
            }
        }
        
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
        
        vm.placeholder =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.placeholder)
                {
                    if (vm.componentConstruction.placeholder.getter)
                        return vm.componentConstruction.placeholder.getter();
                    
                    if (vm.componentConstruction.placeholder.text)
                        return vm.componentConstruction.placeholder.text;
                }

                //Default value
                return ""; 
            }
        };

        vm.disabled = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.disabled)
                    return vm.componentConstruction.disabled;

                //Default value
                return false; 
            }
        }

        vm.loadAllItems = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.loadAllItems)
                    return vm.componentConstruction.loadAllItems;
                
                //Default Value
                return false;
            }
        }

        vm.noCache = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.noCache != null)
                    return vm.componentConstruction.noCache;

                //Default value
                return true; 
            }
        }
        
        vm.notFoundText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.notFoundText)
                {
                    if (vm.componentConstruction.notFoundText.getter)
                        return vm.componentConstruction.notFoundText.getter();
                    
                    if (vm.componentConstruction.notFoundText.text)
                        return vm.componentConstruction.notFoundText.text;
                }

                //Default value
                return 'No hay coincidencias. ';
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

        vm.canCreateNewEntity = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.canCreateNewEntity)
                    return vm.componentConstruction.canCreateNewEntity;

                //Default value
                return false;
            }
        }

        vm.maxItemsQuery = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.maxItemsQuery)
                    return vm.componentConstruction.maxItemsQuery;

                //Default value
                return 10;
            }
        }

        vm.keyProperty =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.keyProperty)
                    return vm.componentConstruction.keyProperty;

                //Default value
                if (vm.queryDetails && vm.queryDetails.resource)
                    return vm.queryDetails.resource.getKeyProperty.get();

                return 'id';
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
        
        vm.getConstantFilters = () =>
        {
            var constantFilters = [];
            if (vm.queryDetails && vm.queryDetails.constantFilters)
            {
                if (vm.queryDetails.constantFilters.getter)
                    constantFilters = vm.queryDetails.constantFilters.getter();
                else
                    constantFilters = vm.queryDetails.constantFilters;                    
            }

            return constantFilters;                
        };
        //=======================================================================================================================================================================



        //Methods________________________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.$onInit = () =>
        {
            if (vm.loadAllItems.get())
                loadCollection();
            checkoutputs();
            _defaultTitle = vm.title.get();
            setValues();
        }
       
        let loadCollection = () =>
        {
            vm.queryDetails
                .resource
                .getCollection((results) => { 
                                                vm.items = results;
                                            });
        }

        let checkoutputs = () =>
        {
            vm.componentBindingOut = 
            { 
                selectedEntity:
                {
                    get: () => { if (vm.entityList && vm.entityList.length > 0) return vm.entityList.filter( D_entity => { return vm.selectedItem == vm.mappingMethod.get()(D_entity); } )[0]; },
                    set: (value) => { if (value) getEntity(value); else { vm.showList = []; vm.selectedItem = undefined; vm.entityList = []; } }
                }
            };

            if (vm.componentConstruction.init)
                vm.componentConstruction.init();

            vm.loadingFirstRequest = false;
        }

        vm.getDisplayValue = () =>
        {
            if (vm.valueModel && vm.selectedItem)
                return vm.selectedItem;

            if (vm.valueModel && !vm.selectedItem && !vm.loadingFirstRequest)
                getEntity(vm.valueModel);

            return vm.nullValueLabel.get();
        };

        vm.getValue = () =>
        {
            if (vm.valueModel)
                return vm.valueModel;

            return undefined;
        };

        let constructFilters = (searchText) =>
        {
            //Construct Filters
            var allFilters = [];

            if (vm.queryDetails && vm.componentConstruction.searchProperties && vm.componentConstruction.searchProperties.length > 0)
                allFilters = allFilters.concat(vm.componentConstruction.searchProperties.map((D_searchProperty) => { return { property: D_searchProperty, value: searchText, operator: 'lk' } } ));
                
            if (vm.queryDetails && vm.queryDetails.filters)
                allFilters = allFilters.concat(vm.queryDetails.filters);

            if (vm.getConstantFilters())
                allFilters = allFilters.concat(vm.getConstantFilters());
                
            return allFilters;
        }

        let setValueModel = (value, entity) =>
        {
            if (vm.valueModel != value)
                vm.valueModel = value;
            if (vm.onChange)
                vm.onChange({ oldValue: vm.valueModel, newValue: value, entity: entity });
        }

        vm.updateData = (data) =>
        {
            var typedText = data.search;

            vm.queryDetails
                .resource
                    .getCollection( 
                                        (results) => 
                                        {
                                            if (results.length > 0)
                                            {
                                                vm.entityList = results;
                                                vm.showList = results.map(vm.mappingMethod.get());
                                                vm.title.set(_defaultTitle);
                                            }
                                            else
                                            {
                                                vm.showList = [];
                                                if (vm.canCreateNewEntity.get())
                                                {
                                                    vm.showList = [typedText];
                                                    vm.title.set(_defaultTitle + ': ' + vm.createNewEntityMessage.get() + typedText )
                                                }
                                            }
                                            data.resolve(vm.showList);
                                        }, 
                                        (error) =>
                                        {
                                            if (data.reject)
                                                data.reject();
                                        },
                                        constructFilters(typedText)
                                    );
        };

        let getInitialData = (data) =>
        {
            var maxItems = vm.maxItemsQuery.get();
            vm.queryDetails
                .resource
                    .getCollection( 
                                        (results) => 
                                        {  
                                            vm.entityList = results;
                                            vm.showList = results.map(vm.mappingMethod.get());
                                            data.resolve(vm.showList);
                                            vm.title.set(_defaultTitle);
                                        }, 
                                        (error) =>
                                        {
                                            if (data.reject)
                                                data.reject();
                                        },
                                        vm.getConstantFilters().concat([{ property: 'skip', value: 0, type: 'fixed_filter' }, { property: 'take', value: maxItems, type: 'fixed_filter' }])
                                        //,{ skip: 0, take: maxItems }
                                    );
                     
        }

        let getEntity = (id) =>
        {
            vm.loadingFirstRequest = true;
            vm.queryDetails
                .resource
                    .getCollection( 
                                        (results) => 
                                        {
                                            if (results.length > 0)
                                            {
                                                vm.entityList = results;
                                                vm.showList = results.map(vm.mappingMethod.get());
                                                vm.selectedItem = vm.showList[0];
                                                vm.loadingFirstRequest = true;
                                            }
                                        }, 
                                        (error) =>
                                        {
                                            
                                        },
                                        [{ property: vm.keyProperty.get(), value: id, type: 'fixed_filter' }]
                                    );
        }

        // Autosearch control
        var planedUpdate;
        
        function cleanPlannedUpdate()
        {
            if (planedUpdate)
            {
                $timeout.cancel(planedUpdate);
                planedUpdate = null;
            }
        }

        function createPlannedUpdate(resolve, reject, searchText)
        {
            planedUpdate = $timeout(vm.updateData, 500, true, { search: searchText, resolve: resolve, reject: reject }); 
        }

        function createPlannedInsert(resolve, reject, searchText)
        {
            planedUpdate = $timeout(getInitialData, 500, true, { search: searchText, resolve: resolve, reject: reject }); 
        }
        
        vm.searchItems = (searchText) =>
        {
            if (searchText && vm.loadAllItems.get())
            {
                var items = vm.items.filter((e)=>{return e[vm.componentConstruction.searchProperties[0]].indexOf(searchText) >= 0;});
                return items;
            }
            else if (searchText)
            {
                return new Promise((resolve, reject)=>
                {
                    setValueModel(undefined);
                    cleanPlannedUpdate();
                    createPlannedUpdate(resolve, reject, searchText);
                }); 
            }
            return new Promise((resolve, reject) =>
            {
                setValueModel(undefined);
                cleanPlannedUpdate();
                createPlannedInsert(resolve, reject, searchText);
            });
        };

        vm.changeSelectedItem = () =>
        {
            var entity = vm.entityList.filter( D_entity => { return vm.selectedItem == vm.mappingMethod.get()(D_entity); } )[0];
            if (!vm.canCreateNewEntity.get())
            {
                if (vm.selectedItem)
                    setValueModel(vm.queryDetails.resource.getId(entity), entity);
                else
                    setValueModel(undefined);    
            }
            else
            {
                if (vm.onChange)
                    vm.onChange({ oldValue: undefined, newValue: vm.selectedItem, entity: entity });
                
                if (entity && vm.selectedItem)
                    setValueModel(vm.queryDetails.resource.getId(entity), entity);
            }
            cleanPlannedRecharge();
            plannedRecharge = $timeout(setValues, 1500);
        }

        vm.onFocus = ($event) =>
        {
            if ($event.target && $event.target.value && $event.target.value.length > 0 && $event.type == 'click')
                $event.target.select();
        }

        function cleanPlannedRecharge()
        {
            if (plannedRecharge)
            {
                $timeout.cancel(plannedRecharge);
                plannedRecharge = null;
            }
        };

        function setValues()
        {
            vm.isForm.value = vm.isForm.get();
            vm.tooltip.value = vm.tooltip.get();
            vm.title.value = vm.title.get();
            vm.name.value = vm.name.get();
            vm.isRequired.value = vm.isRequired.get();
            vm.requiredMessage.value = vm.requiredMessage.get();
            vm.requiredMatch.value = vm.requiredMatch.get();
            vm.requiredMatchMessage.value = vm.requiredMatchMessage.get();
            vm.maxLength.value = vm.maxLength.get();
            vm.maxLengthMessage.value = vm.maxLengthMessage.get();
            vm.minLength.value = vm.minLength.get();
            vm.minLengthMessage.value = vm.minLengthMessage.get();
            vm.minLengthRequest.value = vm.minLengthRequest.get();
            vm.createNewEntityMessage.value = vm.createNewEntityMessage.get();
            vm.nullValueLabel.value = vm.nullValueLabel.get();
            vm.placeholder.value = vm.placeholder.get();
            vm.disabled.value = vm.disabled.get();
            vm.noCache.value = vm.noCache.get();
            vm.notFoundText.value = vm.notFoundText.get();
            vm.getDisplayValue();
        }

        $scope.$watch(() => { return vm.valueModel; }, (newValue, oldValue) => { if (newValue != oldValue) { setValues(); } });
 
        //=======================================================================================================================================================================



    };

    componentcontroller.$inject = ['$timeout', 'EntifixStringUtils', '$scope'];

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
        //templateUrl: 'src/shared/components/entifixAutocomplete/entifixAutocomplete.html',
        template: '<div ng-class="{\'whirl double-up whirlback\': vm.isLoading.get()}"> \
                        <md-tooltip ng-if="vm.tooltip.value" md-direction="left">{{vm.tooltip.value}}</md-tooltip> \
                        <div ng-if="vm.isForm.value"> \
                            <div ng-if="vm.canShowEditableFields.get()" ng-click="vm.onFocus($event)"> \
                                <md-autocomplete \
                                    md-floating-label={{vm.title.value}} \
                                    md-input-name={{vm.name.value}} \
                                    md-min-length="vm.minLengthRequest.value" \
                                    md-input-minlength="{{vm.minLength.value}}" \
                                    md-input-maxlength="{{vm.maxLength.value}}" \
                                    md-no-cache="vm.noCache.value" \
                                    md-selected-item="vm.selectedItem" \
                                    md-search-text="vm.searchText" \
                                    md-items="item in vm.searchItems(vm.searchText)" \
                                    md-item-text="item" \
                                    md-selected-item-change="vm.changeSelectedItem()" \
                                    ng-required="vm.isRequired.value" \
                                    md-require-match="vm.requiredMatch.value" \
                                    placeholder="{{vm.placeholder.value}}" \
                                    ng-disabled="vm.disabled.value" \
                                    md-clear-button="true"> \
                                    <md-item-template> \
                                        <span md-highlight-text="vm.searchText" md-highlight-flags="^i">{{item}}</span> \
                                    </md-item-template> \
                                    <md-not-found> \
                                        <div> \
                                            {{vm.notFoundText.value}} \
                                        </div> \
                                    </md-not-found> \
                                    <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                        <div ng-message="required">{{vm.requiredMessage.value}}</div> \
                                        <div ng-message="md-require-match">{{vm.requiredMatchMessage.value}}</div> \
                                        <div ng-message="minlength">{{vm.minLengthMessage.value}}</div> \
                                        <div ng-message="maxlength">{{vm.maxLengthMessage.value}}</div> \
                                    </div> \
                                </md-autocomplete> \
                            </div> \
                            <div ng-if="!vm.canShowEditableFields.get()"> \
                                <label>{{vm.title.value}}</label><br/> \
                                <strong>{{vm.selectedItem}}</strong> \
                            </div> \
                        </div> \
                        <div ng-if="!vm.isForm.value" ng-click="vm.onFocus($event)"> \
                            <md-autocomplete \
                                md-floating-label={{vm.title.value}} \
                                md-input-name={{vm.name.value}} \
                                md-min-length="vm.minLengthRequest.value" \
                                md-input-minlength="{{vm.minLength.value}}" \
                                md-input-maxlength="{{vm.maxLength.value}}" \
                                md-no-cache="vm.noCache.value" \
                                md-selected-item="vm.selectedItem" \
                                md-search-text="vm.searchText" \
                                md-items="item in vm.searchItems(vm.searchText)" \
                                md-item-text="item" \
                                md-selected-item-change="vm.changeSelectedItem()" \
                                ng-required="vm.isRequired.value" \
                                md-require-match="vm.requiredMatch.value" \
                                placeholder="{{vm.placeholder.value}}" \
                                ng-disabled="vm.disabled.value" \
                                md-clear-button="true"> \
                                <md-item-template> \
                                    <span md-highlight-text="vm.searchText" md-highlight-flags="^i">{{item}}</span> \
                                </md-item-template> \
                                <md-not-found> \
                                    {{vm.notFoundText.value}} \
                                </md-not-found> \
                                <div ng-messages="vm.canEvaluateErrors.get()" multiple> \
                                    <div ng-message="required">{{vm.requiredMessage.value}}</div> \
                                    <div ng-message="md-require-match">{{vm.requiredMatchMessage.value}}</div> \
                                    <div ng-message="minlength">{{vm.minLengthMessage.value}}</div> \
                                    <div ng-message="maxlength">{{vm.maxLengthMessage.value}}</div> \
                                </div> \
                            </md-autocomplete> \
                        </div> \
                    </div>',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixAutocomplete', component);

})();