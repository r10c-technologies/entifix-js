(function () {
    'use strict';
   
    function componentcontroller($timeout)
    {
        var vm = this;
        var randomNumber = Math.floor((Math.random() * 100) + 1);
        var _defaultTitle;

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
        
        vm.requiredMatch =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.requiredMatch)
                    return vm.componentConstruction.requiredMatch;

                //Default value
                return false;
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
                if (getCleanedString(vm.title.get()) != '')
                    return getCleanedString(vm.title.get())
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

        vm.floating = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.floating != null)
                    return vm.componentConstruction.floating;

                //Default value
                return true; 
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
        
        vm.getConstantFilters = function()
        {
            var constantFilters = null;
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

        vm.$onInit = function()
        {
            if (vm.loadAllItems.get())
                loadCollection();
            checkoutputs();
            _defaultTitle = vm.title.get();
        }
       
        function loadCollection()
        {
            vm.queryDetails
                .resource
                .getCollection((results) => { 
                                                vm.items = results;
                                            });
        }

        function checkoutputs()
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

        vm.getDisplayValue = function()
        {
            if (vm.valueModel && vm.selectedItem)
                return vm.selectedItem;

            if (vm.valueModel && !vm.selectedItem && !vm.loadingFirstRequest)
                getEntity(vm.valueModel);

            return vm.nullValueLabel.get();
        };

        vm.getValue = function()
        {
            if (vm.valueModel)
                return vm.valueModel;

            return null;
        };

        function getCleanedString(stringToClean)
        {
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

        function constructFilters(searchText)
        {
            //Construct Filters
            var allFilters = [];

            if (!vm.queryDetails.operator || vm.queryDetails.operator == 'or')
                allFilters.push( { property: 'operator', value: 'or' } );

            if (vm.queryDetails && vm.componentConstruction.searchProperties && vm.componentConstruction.searchProperties.length > 0)
                allFilters = allFilters.concat( vm.componentConstruction.searchProperties.map( (D_searchProperty) => { return { property: D_searchProperty, value: 'like;' + searchText } } ));
                
            if (vm.queryDetails && vm.queryDetails.filters)
                allFilters = allFilters.concat(vm.queryDetails.filters);

            if (vm.getConstantFilters())
                allFilters = allFilters.concat(vm.getConstantFilters());
                
            return allFilters;
        }

        function setValueModel(value, entity)
        {
            if (vm.valueModel != value)
            {
                vm.valueModel = value;
                if (vm.onChange)
                    vm.onChange({ oldValue: vm.valueModel, newValue: value, entity: entity }); 
            }  
        }

        vm.updateData = function(data)
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

        function getInitialData(data)
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
                                        vm.getConstantFilters(),
                                        { skip: 0, take: maxItems }
                                    );
                     
        }

        function getEntity(id)
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
                                                vm.firstRequest = false;
                                            }
                                        }, 
                                        (error) =>
                                        {
                                            
                                        },
                                        [{ property: vm.keyProperty.get(), value: id}]
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
        
        vm.searchItems = function(searchText)
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
                    setValueModel(null);
                    cleanPlannedUpdate();
                    createPlannedUpdate(resolve, reject, searchText);
                }); 
            }
            return new Promise((resolve, reject) =>
            {
                setValueModel(null);
                cleanPlannedUpdate();
                createPlannedInsert(resolve, reject, searchText);
            });
        };

        vm.changeSelectedItem = function()
        {
            var entity = vm.entityList.filter( D_entity => { return vm.selectedItem == vm.mappingMethod.get()(D_entity); } )[0];
            if (!vm.canCreateNewEntity.get())
            {
                if (vm.selectedItem)
                    setValueModel(vm.queryDetails.resource.getId(entity), entity);
                else
                    setValueModel(null);    
            }
            else
            {
                if (vm.onChange)
                    vm.onChange({ oldValue: null, newValue: vm.selectedItem, entity: entity });
                
                if (entity && vm.selectedItem)
                    setValueModel(vm.queryDetails.resource.getId(entity), entity);
            }
        }

        vm.onFocus = function($event)
        {
            if ($event.target && $event.target.value && $event.target.value.length > 0 && $event.type == 'click')
                $event.target.select();
        }
 
        //=======================================================================================================================================================================



    };

    componentcontroller.$inject = ['$timeout'];

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
        templateUrl: 'src/shared/components/entifixAutocomplete/entifixAutocomplete.html',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixAutocomplete', component);

})();