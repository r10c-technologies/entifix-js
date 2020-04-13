
(function(){
    'use strict';

    var module = angular.module('entifix-js');

    componentController.$inject = ['BaseComponentFunctions','EntifixNotification', '$timeout', 'EntifixPager', '$stateParams', '$state', 'EntifixResource', '$mdMenu', 'EntifixDateGenerator', 'EntifixSession', 'EntifixConfig', 'EntifixDownloadReportSettings'];

    function componentController(BaseComponentFunctions, EntifixNotification, $timeout, EntifixPager, $stateParams, $state, EntifixResource, $mdMenu, EntifixDateGenerator, EntifixSession, EntifixConfig, EntifixDownloadReportSettings)
    {
        var vm = this;
        var cont = 0;
        var onLoading = true;
        var isFirstLoad = true;
        var filters;

        // Properties & Fields ===================================================================================================================================================
        
        //Fields
        var _isloading = false;
        var _total = 0;
        var _canShowSearchText = true;
        var _transformValues;
        let _xlsSheetResource = EntifixConfig.xlsSheetResourceName.get() ? new EntifixResource(EntifixConfig.xlsSheetResourceName.get()) : "";
        let _pdfResource = EntifixConfig.xlsSheetResourceName.get() ? new EntifixResource(EntifixConfig.pdfResourceName.get()) : "";
        let originatorEvXls;
        let originatorEvPdf;
        
        // Main
        vm.isLoading =
        {
            get: () => 
            {
                 if (vm.queryDetails && vm.queryDetails.resource)
                     return vm.queryDetails.resource.isLoading.get();
                return _isloading; 
            }
        };

        vm.isDeleting =
        {
            get: () =>
            {
                if (vm.queryDetails && vm.queryDetails.resource)
                    return vm.queryDetails.resource.isDeleting.get();
                return false;
            }
        };

        vm.total = 
        {
            get: () => { return _total; }
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
                return 'Listado';
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
        }

        // search button 
        vm.canSearch = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.search)
                    return true;

                //Default value
                return false;
            }
        };

        vm.searchIcon =
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.search &&  vm.componentConstruction.search.icon)
                    return  vm.componentConstruction.search.icon;

                //Default value
                return 'search';
            } 
        };
        
        vm.searchText =
        {
            get: () => 
            {
                if (vm.componentConstruction && vm.componentConstruction.search &&  vm.componentConstruction.search.text)
                    return '' + vm.componentConstruction.search.text;

                //Default value
                return 'Buscar';
            } 
        };

        vm.canShowSearchText = 
        {
            get: () => { return _canShowSearchText; },
            set: (value) => { _canShowSearchText = value; }
        };

        // add button
        vm.canAdd = 
        {            
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.add)
                    return true;

                //Default value
                return false;
            }
        };

        vm.multipleAddOptions =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.add && vm.componentConstruction.add.options)
                    return true;

                //Default value
                return false;
            }
        };

        vm.addIcon =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.add && vm.componentConstruction.add.icon)
                    return  vm.componentConstruction.add.icon;

                //Default value
                return 'add';
            }
        };

        vm.addText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.add && vm.componentConstruction.add.text)
                    return  vm.componentConstruction.add.text;

                //Default value
                return 'Nuevo';
            }
        };

        // edit button
        vm.canEdit = 
        {            
            get: () =>
            {
                if (vm.componentConstruction && vm.connectionComponent.elementsSelection() == 1)
                {
                    if (vm.componentConstruction.edit && vm.componentConstruction.edit.enable != null)
                    {
                        if (vm.componentConstruction.edit.enable instanceof Object && vm.componentConstruction.edit.enable.getter)
                            return vm.componentConstruction.edit.enable.getter();
                        else if (vm.componentConstruction.edit.enable != null)
                            return vm.componentConstruction.edit.enable;
                    }
                    else if (vm.componentConstruction.edit)
                        return true;
                }

                //Default value
                return false;
            }
        };

        vm.multipleEditOptions =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.componentConstruction.edit.options)
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
                return 'visibility';
            }
        };

        vm.editText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.edit && vm.componentConstruction.edit.text)
                    return  vm.componentConstruction.edit.text;

                //Default value
                return 'Detalle';
            }
        };

        // remove button
        vm.canRemove = 
        {            
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.connectionComponent.elementsSelection() >= 1)
                    return true;

                //Default value
                return false;
            }
        };

        vm.multipleRemoveOptions =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.componentConstruction.remove.options)
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
                if (vm.componentConstruction && vm.componentConstruction.remove && vm.componentConstruction.remove.text)
                    return  vm.componentConstruction.remove.text;

                //Default value
                return 'Eliminar';
            }
        };

        vm.xlsSheetIcon =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.xlsSheetIcon && vm.componentConstruction.xlsSheetIcon.icon)
                    return  vm.componentConstruction.xlsSheetIcon.icon;

                //Default value
                return 'poll';
            }
        };

        vm.xlsSheetText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.xlsSheetText && vm.componentConstruction.xlsSheetText.text)
                    return  vm.componentConstruction.xlsSheetText.text;

                //Default value
                return 'Descargar Excel';
            }
        };

        vm.canDownloadXlsSheet =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.canDownloadXlsSheet != null)
                    return vm.componentConstruction.canDownloadXlsSheet;

                //Default value
                return true;
            }
        };

        vm.pdfIcon =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.pdfIcon && vm.componentConstruction.pdfIcon.icon)
                    return  vm.componentConstruction.pdfIcon.icon;

                //Default value
                return 'picture_as_pdf';
            }
        };

        vm.pdfText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.pdfText && vm.componentConstruction.pdfText.text)
                    return  vm.componentConstruction.pdfText.text;

                //Default value
                return 'Descargar Pdf';
            }
        };

        vm.canDownloadPdf =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.canDownloadPdf != null)
                    return vm.componentConstruction.canDownloadPdf;

                //Default value
                return true;
            }
        };

        vm.allPagesText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.allPagesText && vm.componentConstruction.allPagesText.text)
                    return  vm.componentConstruction.allPagesText.text;

                //Default value
                return 'Descargar todas las páginas';
            }
        };

        vm.currentPageText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.currentPageText && vm.componentConstruction.currentPageText.text)
                    return  vm.componentConstruction.currentPageText.text;

                //Default value
                return 'Descargar página actual';
            }
        };

        vm.columnsText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.columnsText)
                    return  vm.componentConstruction.columnsText;

                //Default value
                return 'Columnas';
            }
        };

        vm.customSearchText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.customSearchText)
                    return  vm.componentConstruction.customSearchText;

                //Default value
                return 'Búsqueda Avanzada';
            }
        };

        vm.propertiesOperators =
        {
            defaults: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.defaultOperators)
                    return  vm.componentConstruction.defaultOperators;

                //Default value
                return [{ display: 'Igual', operator: '=' },
                        { display: 'Mayor que', operator: '>' },
                        { display: 'Menor que', operator: '<' },
                        { display: 'Mayor o igual que', operator: '>=' },
                        { display: 'Menor o igual que', operator: '<=' },
                        { display: 'Diferente', operator: '<>' },
                        { display: 'Incluya', operator: 'lk'}];
            },

            strings: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.stringOperators)
                    return  vm.componentConstruction.stringOperators;

                //Default value
                return [{ display: 'Igual', operator: '=' },
                        { display: 'Diferente', operator: '<>' },
                        { display: 'Incluya', operator: 'lk'}];
            },

            numbers: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.numberOperators)
                    return  vm.componentConstruction.numberOperators;

                //Default value
                return [{ display: 'Igual', operator: '=' },
                        { display: 'Mayor que', operator: '>' },
                        { display: 'Menor que', operator: '<' },
                        { display: 'Mayor o igual que', operator: '>=' },
                        { display: 'Menor o igual que', operator: '<=' },
                        { display: 'Diferente', operator: '<>' }];
            },

            booleans: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.booleanOperators)
                    return  vm.componentConstruction.booleanOperators;

                //Default value
                return [{ display: 'Igual', operator: '=' },
                        { display: 'Diferente', operator: '<>' }];
            },

            enums: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.enumOperators)
                    return  vm.componentConstruction.enumOperators;

                //Default value
                return [{ display: 'Igual', operator: '=' },
                        { display: 'Diferente', operator: '<>' }];
            }
        };

        vm.operatorsText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.operatorsText)
                    return  vm.componentConstruction.operatorsText;

                //Default value
                return 'Operadores';
            }
        };

        vm.valueToSearchText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.valueToSearchText)
                    return  vm.componentConstruction.valueToSearchText;

                //Default value
                return 'Valor';
            }
        };

        vm.addFilterText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.addFilterText)
                    return  vm.componentConstruction.addFilterText;

                //Default value
                return 'Agregar';
            }
        };

        vm.selectColumns =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.selectColumns != null)
                    return  vm.componentConstruction.selectColumns;

                //Default value
                return true;
            }
        };

        vm.queryParams =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.queryParams != null)
                    return  vm.componentConstruction.queryParams;

                //Default value
                return true;
            }
        };

        vm.isMovement =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.isMovement != null)
                    return  vm.componentConstruction.isMovement;

                //Default value
                return false;
            }
        };

        vm.startDateText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.startDateText)
                    return  vm.componentConstruction.startDateText;

                //Default value
                return 'Fecha Documento Del';
            }
        };

        vm.startDateProperty =
        {
            get: () =>
            {
                if (vm.queryDetails && vm.queryDetails.resource && vm.queryDetails.resource.getStartDateProperty())
                    return  vm.queryDetails.resource.getStartDateProperty();

                //Default value
                return 'fechaDocumento';
            }
        };

        vm.endDateText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.endDateText)
                    return  vm.componentConstruction.endDateText;

                //Default value
                return 'Fecha Documento Al';
            }
        };

        vm.endDateProperty =
        {
            get: () =>
            {
                if (vm.queryDetails && vm.queryDetails.resource && vm.queryDetails.resource.getEndDateProperty())
                    return  vm.queryDetails.resource.getEndDateProperty();

                //Default value
                return 'fechaDocumento';
            }
        };

        vm.notAppliedText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.notAppliedText)
                    return  vm.componentConstruction.notAppliedText;

                //Default value
                return { basic: 'Pendientes', extended: 'Mostrar únicamente registros pendientes' };
            }
        };

        vm.notApplyProperty =
        {
            get: () =>
            {
                if (vm.queryDetails && vm.queryDetails.resource && vm.queryDetails.resource.getNotApplyProperty())
                    return  vm.queryDetails.resource.getNotApplyProperty();

                //Default value
                return 'estado';
            }
        };

        vm.notApplyValue =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.notApplyValue)
                    return  vm.componentConstruction.notApplyValue;

                //Default value
                return 'REGISTRADO';
            }
        };

        vm.selectAllText =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.selectAllText)
                    return vm.componentConstruction.selectAllText;

                //Default value
                return 'Seleccionar todos';
            }
        };

        vm.pagerConfiguration =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.pagerConfiguration)
                    return vm.componentConstruction.pagerConfiguration;

                //Default value
                return null;
            }
        }

        vm.blockTableOnChangeView =
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.blockTableOnChangeView)
                    return vm.componentConstruction.blockTableOnChangeView;
                
                //Default value
                return false;
            }
        }

        vm.allowCustomSearch = 
        {
            get: () =>
            {
                if (vm.componentConstruction && vm.componentConstruction.allowCustomSearch != null)
                    return vm.componentConstruction.allowCustomSearch;

                //Default value
                return true;
            }
        }

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

        vm.hasAddPermission = 
        {
            get: () =>
            {
                if (!vm.componentConstruction.permissions.add || (vm.componentConstruction.permissions.add != null && EntifixSession.checkPermissions(vm.componentConstruction.permissions.add)))
                    return true;

                //Default value
                return false;
            }
        }

        vm.hasEditPermission = 
        {
            get: () =>
            {
                if (!vm.componentConstruction.permissions.edit || (vm.componentConstruction.permissions.edit != null && EntifixSession.checkPermissions(vm.componentConstruction.permissions.edit)))
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

        vm.hasXlsSheetPermission = 
        {
            get: () =>
            {
                if (!vm.componentConstruction.permissions.xlsSheet || (vm.componentConstruction.permissions.xlsSheet != null && EntifixSession.checkPermissions(vm.componentConstruction.permissions.xlsSheet)))
                    return true;

                //Default value
                return false;
            }
        }

        vm.hasPdfPermission = 
        {
            get: () =>
            {
                if (!vm.componentConstruction.permissions.pdf || (vm.componentConstruction.permissions.pdf != null && EntifixSession.checkPermissions(vm.componentConstruction.permissions.pdf)))
                    return true;

                //Default value
                return false;
            }
        }
        // =======================================================================================================================================================================
        
        // Methods ===============================================================================================================================================================

        vm.$onInit = () =>
        {
            setdefaults();
            createconnectioncomponent();
            setDefaultsTable();
            checkPermissions();
            activate();
            checkoutputs();
        };

        function setdefaults()
        {
            setProperties();
            createComponents();
            setDateProperties();
        };

        function createconnectioncomponent()
        {
            //object to connect to sub-component
            vm.connectionComponent = {};

            //Pager instance creation
            vm.pager = new EntifixPager(vm.queryDetails, vm.pagerConfiguration.get(), (vm.componentConstruction.transformData ? vm.componentConstruction.transformData.columns : []));
            vm.pager.searchTextGetter.set(() => {
                                                if (vm.canShowSearchText.get() && vm.textBoxSearchValue && vm.textBoxSearchValue.length > 0)
                                                    return vm.textBoxSearchValue;
                                                return null;
                                            });

            vm.pager.searchArrayGetter.set(() => {
                                                if (vm.canShowSearchText.get() && vm.searchArray && vm.searchArray.length > 0)
                                                    return vm.searchArray;
                                                return null;
                                            });

            vm.pager.columnsSelectedGetter.set(() => {
                                                if (vm.columnsSelected && vm.columnsSelected.length > 0)
                                                    return vm.columnsSelected;
                                                return null;
                                            });     

            vm.connectionComponent.pager = vm.pager;
            vm.connectionComponent.resourceMembers = { get: () => { return vm.resourceMembers } };
            vm.connectionComponent.onChangePageSize = vm.onChangePageSize;

            //Connection Component Properties __________________________________________________________________________________________
            

            //Connection Component Methods _____________________________________________________________________________________________

            vm.connectionComponent.elementsSelection = () =>
            {
                if (vm.connectionComponent.pager != null && vm.connectionComponent.pager.currentData != null && vm.connectionComponent.pager.currentData.length > 0)
                    return vm.connectionComponent.pager.currentData.filter((value) => { return value.$selected == true; }).length;
                return 0;
            };

            vm.connectionComponent.getSelectedElements = () =>
            {
                if (vm.connectionComponent.pager != null && vm.connectionComponent.pager.currentData != null)
                    return vm.connectionComponent.pager.currentData.filter((value) => { return value.$selected == true; });
                return [];
            };

            vm.connectionComponent.sortTable = (column) =>
            {
                if (!column.$selected)
                    column.$selected = true;
                else
                    column.$selected = false;
                
                vm.resourceMembers.filter((p) => { return (p.display != column.display); }).forEach((p) => { p.$selected = null; });
                setClassColumn();
                vm.connectionComponent.pager.sortTableColumns.set([{ sort: (column.pageProperty || column.name), value: (column.$selected ? 'asc' : 'desc') }]);
                vm.connectionComponent.pager.reload();
            };

            vm.connectionComponent.singleElementSelection = (element, forceSelection) =>
            {
                if (vm.connectionComponent.allowSelection())
                {                    
                    if (vm.connectionComponent.elementsSelection() > 1 || forceSelection)
                        element.$selected = true;
                    else
                        element.$selected = !element.$selected;

                    vm.connectionComponent.pager.currentData.filter((value)  => { return (value != element); }).forEach((value) => { value.$selected = false });

                    if (element.$selected)
                        vm.connectionComponent.selectedElement = element;
                    else
                        vm.connectionComponent.selectedElement = null;

                    vm.connectionComponent.onChangeElementsSelection();
                }
            };
            
            vm.connectionComponent.multipleElementsSelection = (element) =>
            {
                if (vm.connectionComponent.allowSelection())
                {
                    element.$selected = !element.$selected;

                    if (element.$selected)
                        vm.connectionComponent.selectedElement = element;
                    else 
                    {
                        var selection = vm.connectionComponent.pager.currentData.filter(value => { return (value.$selected === true); });

                        if (selection.length > 0)
                            vm.connectionComponent.selectedElement = selection[0];
                        else
                            vm.connectionComponent.selectedElement = null;
                    }

                    vm.connectionComponent.onChangeElementsSelection();
                }
            };

            vm.connectionComponent.directEditionElement = (element) =>
            {
                if (vm.componentConstruction.edit)
                {
                    if (vm.blockTableOnChangeView.get())
                        vm.isChangingView = true;
                    vm.connectionComponent.singleElementSelection(element, true);
                    vm.editElement();
                }
            };

            vm.connectionComponent.checkAll = (allSelected) =>
            {
                if (allSelected && vm.connectionComponent.pager.currentData)
                    vm.connectionComponent.pager.currentData.forEach((element) => { element.$selected = true; });
                else if (vm.connectionComponent.pager.currentData)
                    vm.connectionComponent.pager.currentData.forEach((element) => { element.$selected = false; });
            }

            vm.connectionComponent.showColumn = (column) =>
            {
                var columnsFilter = vm.columnsSelected.filter((c) => { return c == column; });
                if (columnsFilter && columnsFilter.length > 0)
                    return true;
                return false;
            };
            
            vm.connectionComponent.onChangeElementsSelection = () => { };
            vm.connectionComponent.allowSelection = () => { return true; };

            //Transform values to show in columns
            vm.connectionComponent.transformValue = (value, name) =>
            {                
                if (value != null && vm.componentConstruction && vm.componentConstruction.transformData)
                {
                    var transformColumn = vm.componentConstruction.transformData.columns.filter( (tc)=>{ return tc.property == name; } )[0];

                    //Transform dates
                    if (transformColumn.type == 'date' || transformColumn.type == 'datetime')
                        return transformDate(value, transformColumn.type, true);

                    //Transform navigation
                    if (transformColumn.type == 'entity')
                    {
                        if (_transformValues && _transformValues.length > 0)
                        {
                            var tempCollectionConf = _transformValues.filter((tv) => { return tv.propertyName == name });
                            if (tempCollectionConf.length > 0)
                            {
                                var tempCollectionValues = tempCollectionConf[0].enumResult;
                                if (tempCollectionValues && tempCollectionValues.length > 0)
                                {
                                    var idValue = value;
                                    if (value instanceof Object)
                                        idValue = transformColumn.resource.getId(value);

                                    var tempValues = tempCollectionValues.filter((enumValue) => { return enumValue.Value == idValue; } );
                                    if (tempValues.length > 0)
                                        return tempValues[0].Display;
                                }
                            }
                        }
                    }

                    if (transformColumn.type == 'boolean')
                        return transformBoolean(value);
                }
            };            
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

            if (vm.componentBehavior)
            {
                vm.connectionComponent.showMultiselectColumn = vm.componentBehavior.showMultiselectColumn || false;
                vm.collapsed = vm.componentBehavior.initCollapsed || false;
            }
            
            vm.connectionComponent.pager.reload();
        };
        
        function checkoutputs()
        {
            vm.componentBindingOut = 
            { 
                pager: vm.pager,
                recreateDynamicComponent: createDynamicComponent,
                reloadPagination: ()=>{ if (!vm.pager.isLoading.get()) vm.pager.reload(); },
                allowedActions: { canEdit: vm.canEdit, canRemove: vm.canRemove, canAdd: vm.canAdd },
                cleanFilters: () => { vm.cleanFilters(); },
                reloadComponent: vm.$onInit
            };
        };

        function transformDate(value, type, isForDisplay)
        {
            if (type == 'date' || type == 'datetime' && value)
            {
                if (!(value instanceof Date))
                    var value = transformStringToDate(value);
                var year = value.getFullYear().toString();
                var month = (value.getMonth() + 1).toString();
                var day = value.getDate().toString();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                if (type == 'datetime')
                {
                    var hours = value.getHours().toString();
                    var minutes = value.getMinutes().toString();
                    var seconds = value.getSeconds().toString();
                    if (hours.length < 2)
                        hours = '0' + hours;
                    if (minutes.length < 2)
                        minutes = '0' + minutes;
                    if (seconds.length < 2)
                        seconds = '0' + seconds;
                    
                    if (isForDisplay)
                        return day + '-' +  month + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds;   
                    return year + '-' +  month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;        
                }
                else if (isForDisplay)
                    return day + '-' +  month + '-' + year;
                return year + '-' +  month + '-' + day;
            }
            return value;
        }

        function transformStringToDate(value)
        {
            return EntifixDateGenerator.transformStringToDate(value);
        }

        function transformBoolean(value)
        {
            if (value)
                return 'Si';
            return 'No';
        }

        //Defatult behavior for tool box
        vm.searchElement = () =>
        {
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onSearch)
                vm.componentBehavior.events.onSearch();
            
            if (vm.componentConstruction.search.customAction)
                vm.componentConstruction.search.customAction();
            else
                defaultSearch();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onSearched)
                vm.componentBehavior.events.onSearched();
        };

        vm.addElement = () =>
        {            
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onAdd)
                vm.componentBehavior.events.onAdd();
            
            if (vm.componentConstruction.add.customAction)
                vm.componentConstruction.add.customAction();
            else
                defaultAdd();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onAdded)
                vm.componentBehavior.events.onAdded();
        };

        vm.editElement = () =>
        {
            var elementToEdit = vm.connectionComponent.selectedElement;

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onEdit)
                vm.componentBehavior.events.onEdit();
            
            if (vm.componentConstruction.edit.customAction)
                vm.componentConstruction.edit.customAction(elementToEdit);
            else
                defaultEdit();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onEdited)
                vm.componentBehavior.events.onEdited();
        };

        vm.removeElement = () =>
        {
            var elementsToDelete = vm.connectionComponent.getSelectedElements();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onRemove)
                vm.componentBehavior.events.onRemove();
            
            if (vm.componentConstruction.remove.customAction)
                vm.componentConstruction.remove.customAction(elementsToDelete);
            else
                defaultRemove();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onRemoved)
                vm.componentBehavior.events.onRemoved();
        };

        vm.processElement = () =>
        {
            var elementToProcess = vm.connectionComponent.selectedElement;
            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onProcess)
                vm.componentBehavior.events.onProcess();
            
            if (vm.componentConstruction.process.customAction)
                vm.componentConstruction.process.customAction(elementToProcess);
            else
                defaultProcess();

            if (vm.componentBehavior && vm.componentBehavior.events && vm.componentBehavior.events.onProcessed)
                vm.componentBehavior.events.onProcessed();
        };

        function defaultAdd()
        {
            
        };

        function defaultEdit()
        {

        };

        function defaultRemove()
        {
            var message = '¿Está seguro de elminar el registro seleccionado?';

            if ( vm.connectionComponent.elementsSelection() > 1 )
                message = '¿Está seguro de eliminar todos los registros seleccionados?';
 
            EntifixNotification.confirm({
                                    "body": message, 
                                    "header": 'Confirmación requerida',
                                    "actionConfirm": ()=>    
                                    {
                                        var elementsToDelete = vm.connectionComponent.getSelectedElements();

                                        var requests = vm.connectionComponent.elementsSelection();
                                        var ok = 0;
                                        var e = 0;

                                        var checkCompleted = (response, isError) =>
                                        {
                                            if (isError)
                                                e++;
                                            else
                                                ok++; 

                                            if (e + ok >= requests) {
                                                if (e == 0) {
                                                    if (requests == 1) {
                                                        EntifixNotification.success({"body": 'Registro eliminado exitosamente.'});
                                                    } else {
                                                        EntifixNotification.success({"body": 'Todos los registros fueron eliminados exitosamente.'});
                                                    }
                                                }
                                                else {
                                                    if (requests == 1) {
                                                        EntifixNotification.error({"body": `El registro no pudo ser eliminado. ${response.data.message}`});
                                                    } else {
                                                        EntifixNotification.error({"body": 'Algunos registros no pudieron ser eliminados.'});
                                                    }
                                                }

                                                vm.connectionComponent.pager.reload();
                                                vm.queryDetails.resource.onMultipleDeletion.set(false);
                                            }
                                        };

                                        if (elementsToDelete.length > 1)
                                            vm.queryDetails.resource.onMultipleDeletion.set(true);
                                        vm.connectionComponent
                                            .getSelectedElements()
                                            .forEach((element) => {
                                                                    vm.queryDetails
                                                                        .resource
                                                                        .deleteEntity(element,  (response, isError) => { checkCompleted(response, isError) }, () => { checkCompleted(response, isError)} );
                                                                });
                                    }});
        };

        function defaultProcess()
        {
            
        };

        function defaultSearch()
        {
            _canShowSearchText = !_canShowSearchText;

            if (!_canShowSearchText)
            {
                vm.textBoxSearchValue = null;
                cleanSearch();
            }
        };

        // Autosearch control
        var plannedRecharge;

        function rechargeTable()
        {
            vm.connectionComponent.pager.reload();
            return null;
        };

        function cleanPlannedRecharge()
        {
            if (plannedRecharge)
            {
                $timeout.cancel(plannedRecharge);
                plannedRecharge = null;
            }
        };

        function cleanSearch()
        {
            cleanPlannedRecharge();
            rechargeTable();
        };

        vm.keypressTextBoxSearch = (keyEvent) =>
        {
            cleanPlannedRecharge();            
            if (keyEvent.which === 13)
                rechargeTable();
        };

        vm.onChangeSearch = () =>
        {
            cleanPlannedRecharge();
            plannedRecharge = $timeout(rechargeTable, 1500);
            vm.pager.page = 1;
            filters = null;
            if (vm.queryParams.get())
                $state.go('.', { searchText: vm.textBoxSearchValue, page: 1 }, { notify: false });
        };

        // Filters control
        function setProperties()
        {
            vm.searchArray = [], vm.resourceMembers = [], vm.columnsSelected = [];
            vm.resourceMembers = vm.queryDetails.resource.getMembersResource.get();
            vm.resourceMembers.forEach(property => { property.type ? property.type : property.type = 'text'; property.display ? property.display : property.display = getDisplay(property); if (property.default && property.default != "false") vm.columnsSelected.push(getDisplay(property)); });
            vm.operators = vm.propertiesOperators.defaults();
            setClassColumn();
        }

        function setClassColumn()
        {
            vm.resourceMembers.forEach((property) =>
                                                {
                                                    if (property.$selected)
                                                        property.class = 'md-column sortable sort-descent';
                                                    else if (property.$selected == false)
                                                        property.class = 'md-column sortable sort-ascent';
                                                    else
                                                        property.class = 'md-column sortable';
                                                });
        }

        function setDateProperties()
        {
            if (vm.isMovement.get() && !vm.queryDetails.constantFilters)
            {
                vm.queryDetails.constantFilters = {};
                vm.queryDetails.constantFilters.getter = () => { return [ ]; };
            }
        }

        function setDefaultsTable()
        {
            //Page sets default value
            if ($stateParams.page && vm.queryParams.get())
                vm.pager.page = $stateParams.page;

            //Items per page sets default value
            if ($stateParams.itemsPerPage && vm.queryParams.get())
                vm.pager.size = $stateParams.itemsPerPage;

            //Search text sets default value
            if ($stateParams.searchText && vm.queryParams.get())
            {
                vm.textBoxSearchValue = $stateParams.searchText;
                vm.onChangeSearch();
            }

            //Custom search array sets default value
            if ($stateParams.customSearch && vm.queryParams.get())
            {
                vm.customSearch = true;
                vm.searchArray = JSON.parse($stateParams.customSearch);
                vm.textBoxSearchValueChips = JSON.parse($stateParams.chips);
            }
            else
                vm.customSearch = false;

            //Date filters
            if ($stateParams.startDate && vm.queryParams.get())
                vm.startDate = transformStringToDate($stateParams.startDate);

            if ($stateParams.endDate && vm.queryParams.get())
                vm.endDate = transformStringToDate($stateParams.endDate);

            if (vm.startDate || vm.endDate)
                vm.searchItemsDate(true);
        }

        function createComponents()
        {
            vm.customSearchCC =
            {
                title: { text: vm.customSearchText.get() },
                tooltip: { text: vm.customSearchText.get() },
                isSwitch: true,
                isForm: false,
                includeValue: false
            };
            
            vm.valueToSearchCC = 
            {
                title: { text: vm.valueToSearchText.get() },
                hasTime: false,
                hasMinutes: false,
                isForm: false,
                mapping: { method: (entity) => { return entity.label } },
                collection: { elements: [{ Display: 'Si', Value: "true" }, { Display: 'No', Value: "false" }]}
            };
            
            vm.valueToSearchDTCC = 
            {
                title: { text: vm.valueToSearchText.get() },
                isForm: false
            };
            
            vm.valueToSearchQD = 
            {
                title: { text: vm.valueToSearchText.get() },
                isForm: false
            };

            vm.chipsCC =
            {
                isForm: false,
                transformChip: vm.transformchip,
                readOnly: true,
                onRemove: removeChip
            };
            
            vm.startDateCC = 
            {
                title: { text: vm.startDateText.get() },
                isForm: false,
                hasMinutes: false,
                hasTime: false
            };
            
            vm.endDateCC = 
            {
                title: { text: vm.endDateText.get() },
                isForm: false,
                hasMinutes: false,
                hasTime: false
            };

            vm.notAppliedCC =
            {
                title: { text: vm.notAppliedText.get().basic },
                tooltip: { text: vm.notAppliedText.get().extended },
                isSwitch: true,
                isForm: false,
                includeValue: false
            };
        }

        vm.onChangeColumn = () =>
        {
            vm.valueToSearch = null;

            if (vm.columnToSearch)
            {
                if (vm.columnToSearch.property && vm.columnToSearch.property.resource)
                    vm.valueToSearchQD = { resource: new EntifixResource(vm.columnToSearch.property.resource) };

                if (vm.columnToSearch.type == 'text')
                    vm.operators = vm.propertiesOperators.strings();
                else if (vm.columnToSearch.type == 'number')
                    vm.operators = vm.propertiesOperators.numbers();
                else if (vm.columnToSearch.type == 'enum')
                    vm.operators = vm.propertiesOperators.enums();
                else if (vm.columnToSearch.type == 'boolean')
                    vm.operators = vm.propertiesOperators.booleans();
                else
                    vm.operators = vm.propertiesOperators.defaults();
            }
        }

        vm.onChangeSwitch = (value) =>
        {
            cleanCustomSearchValues(true, value);            
            vm.connectionComponent.pager.reload();
        }

        vm.onChangePageSize = (size) =>
        {
            if (vm.pager.totalData < vm.pager.size) {
                vm.pager.page = 1;
                if (vm.queryParams.get())
                    $state.go('.', { itemsPerPage: vm.pager.size, page: 1 }, {notify: false});
            }
            else if (vm.queryParams.get())
                $state.go('.', { itemsPerPage: vm.pager.size }, {notify: false});

            if (!size) {
                if (!isFirstLoad)
                    vm.pager.reload();
                else
                    isFirstLoad = false;
            }
            else {
                vm.pager.size = size;
                vm.pager.reload();
            }
        }

        vm.onChangePage = () =>
        {
            vm.pager.reload();
            if (vm.queryParams.get())
                $state.go('.', { page: vm.pager.page }, {notify: false});
        }

        vm.addChip = () =>
        {
            if (vm.columnToSearch.display && vm.operator.operator && vm.valueToSearch) {
                vm.valueToSearch = transformDate(vm.valueToSearch, vm.columnToSearch.type);
                vm.textBoxSearchValueChips.push(vm.columnToSearch.display + ' ' + vm.operator.operator + ' ' + vm.valueToSearch);
                vm.searchArray.push({ property: vm.columnToSearch.pageProperty || vm.columnToSearch.name, operator: vm.operator.operator, value: vm.valueToSearch });
            }
            cleanCustomSearchValues();
            setParametersAddChip();
        }

        function removeChip(chip, index)
        {
            vm.searchArray.splice(index, 1);
            if (vm.searchArray.length > 0 && vm.textBoxSearchValueChips.length > 0 && vm.queryParams.get())
                $state.go('.', { customSearch: JSON.stringify(vm.searchArray), chips: JSON.stringify(vm.textBoxSearchValueChips) }, {notify: false});
            else if (vm.queryParams.get())
                $state.go('.', { customSearch: null, chips: null }, {notify: false});
            filters = null;
        }

        function setParametersAddChip()
        {
            vm.pager.page = 1;
            if (vm.queryParams.get())
                $state.go('.', { customSearch: JSON.stringify(vm.searchArray), chips: JSON.stringify(vm.textBoxSearchValueChips), page: vm.pager.page }, {notify: false});
        }

        function cleanCustomSearchValues(cleanedParams, switchValue, cleanedDates)
        {
            vm.columnToSearch = null;
            vm.operator = null;
            vm.valueToSearch = null;
            vm.textBoxSearchValue = null;
            filters = null;

            if (cleanedParams)
                cleanParams(switchValue);

            if (cleanedDates)
                cleanDates();
        }

        function cleanParams(switchValue) {
            if (!switchValue) {
                vm.searchArray = [];
                vm.pager.page = 1;
                if (vm.queryParams.get())
                    $state.go('.', { customSearch: null, chips: null, page: vm.pager.page }, {notify: false});
            }
            else if (vm.queryParams.get())
                $state.go('.', { customSearch: null, chips: null, searchText: null }, {notify: false});
            vm.textBoxSearchValueChips = [];
        }

        function cleanDates() {
            if (vm.queryDetails.constantFilters)
                vm.queryDetails.constantFilters.getter = () => { return []; };
            vm.startDate = null;
            vm.endDate = null;
            vm.notApplied = false;
            $state.go('.', { customSearch: null, chips: null, searchText: null, page: vm.pager.page, itemsPerPage: vm.pager.size, startDate: null, endDate: null }, {notify: false});
        }

        vm.cleanFilters = () =>
        {
            cleanCustomSearchValues(true, false, true);
            vm.connectionComponent.pager.reload();
        }

        function getDisplay(property)
        {
            if (property.display)
                return property.display;
            if (property.name)
                return getCleanedString(property.name);
            return null;
        }

        function getCleanedString(stringToClean)
        {
            return stringToClean.charAt(0).toUpperCase() + stringToClean.substring(1, stringToClean.length).toLowerCase();
        }

        vm.searchItemsDate = (skipReload) =>
        {
            vm.queryDetails.constantFilters.getter = () => { return [ { property: vm.startDateProperty.get(), value: transformDate(vm.startDate, 'datetime'), operator: '>=', type: 'fixed_filter' }, { property: vm.endDateProperty.get(), value: transformDate(vm.endDate, 'datetime'), operator: '<=', type: 'fixed_filter' } ]; };
            if (!skipReload)
                vm.connectionComponent.pager.reload();
        }

        vm.onChangeDateStart = (value) =>
        {
            $state.go('.', { startDate: transformDate(vm.startDate, 'datetime') }, {notify: false});
        }

        vm.onChangeDateEnd = (value) =>
        {
            $state.go('.', { endDate: transformDate(vm.endDate, 'datetime') }, {notify: false});
        }

        vm.onChangeNotApplied = (value) =>
        {
            vm.queryDetails.constantFilters = {};
            var constantFilters = [];
            if (value)
                constantFilters.push({ property: vm.notApplyProperty.get(), value: vm.notApplyValue.get(), type: 'fixed_filter' })
            if (vm.startDate && vm.endDate)
                constantFilters.push({ property: vm.startDateProperty.get(), value: transformDate(vm.startDate, 'datetime'), type: 'fixed_filter', operator: '>=' }, { property: vm.endDateProperty.get(), value: transformDate(vm.endDate, 'datetime'), type: 'fixed_filter', operator: '<=' });
            vm.queryDetails.constantFilters.getter = () => { return constantFilters; };
            vm.connectionComponent.pager.reload();
        }

        vm.selectAllItems = () =>
        {
            onLoading = false;
            if (cont % 2 == 0) {
                vm.columnsSelected = [];
                vm.resourceMembers.forEach((property) => { vm.columnsSelected.push(getDisplay(property))});
            } else {
                vm.columnsSelected = [];
                vm.resourceMembers.forEach((property) => { if (property.default && property.default != "false") vm.columnsSelected.push(getDisplay(property))});
            }
            cont++;
        };

        vm.reloadAllSelected = () =>
        {
            if (!onLoading && cont % 2 != 0)
                vm.columnsSelected.push(vm.selectAllText.get());
            else if (!onLoading) {
                var index = vm.columnsSelected.indexOf(vm.selectAllText.get());
                if (index > 0)
                    vm.columnsSelected.splice(index, 1);
            }
        };

        vm.openXlsSheetMenu = ($mdMenu, ev) =>
        {
            originatorEvXls = ev;
            $mdMenu.open(ev);
        }

        vm.openPdfMenu = ($mdMenu, ev) =>
        {
            originatorEvPdf = ev;
            $mdMenu.open(ev);
        }

        vm.downloadFileSimplePage = (type) =>
        {
            new EntifixDownloadReportSettings().chooseDownloadReportSettings((defaults) => { vm.downloadFileSimplePageResource(type, defaults); });
        }

        vm.downloadFileSimplePageResource = (type, defaults) =>
        {
            let options = {
                type: type,
                requestType: "simple-page",
                data: vm.connectionComponent.pager.currentData,
                title: vm.queryDetails.resource.resourceName.get(),
                fileName: vm.queryDetails.resource.resourceName.get() + " " + new Date().toLocaleString(),
                pageSize: defaults.pageSize || "Letter", 
                tableStriped: defaults.tableStriped != undefined ? defaults.tableStriped : true, 
                pageOrientation: defaults.pageOrientation || "Landscape"
            }

            switch (type) {
                case "pdf":
                    options.contentType = "application/pdf";
                    options.columns = getMembersSelected();
                    _pdfResource.getFile(options);
                    break;

                case "xls":
                    options.contentType = "application/vnd.ms-excel";
                    options.columns = vm.resourceMembers;
                    _xlsSheetResource.getFile(options);
                    break;

                // add more types of download
            }
        }

        vm.downloadFileAllPages = (type) =>
        {
            new EntifixDownloadReportSettings().chooseDownloadReportSettings((defaults) => { vm.downloadFileAllPagesResource(type, defaults); });
        }

        vm.downloadFileAllPagesResource = (type, defaults) =>
        {
            let options = {
                type: type,
                requestType: "all-pages",
                searchText: vm.textBoxSearchValue,
                searchArray: vm.searchArray,
                columnsSelected: vm.columnsSelected,
                constantFilters: vm.getConstantFilters(),
                title: vm.queryDetails.resource.resourceName.get(),
                fileName: vm.queryDetails.resource.resourceName.get() + " " + new Date().toLocaleString(),
                headers: { "X-Requested-Type": type, "X-Page-Size": defaults.pageSize || "Letter", "X-Table-Striped": defaults.tableStriped != undefined ? defaults.tableStriped : true, "X-Page-Orientation": defaults.pageOrientation || "Landscape" }
            }

            switch (type) {
                case "pdf":
                    options.contentType = "application/pdf";
                    break;

                case "xls":
                    options.contentType = "application/vnd.ms-excel";
                    break;

                // add more types of download
            }

            vm.queryDetails.resource.getFile(options);
        }

        function getMembersSelected() {
            let columns = [];
            vm.columnsSelected.forEach(columnSelected => vm.resourceMembers.forEach(resourceMember => { if ((resourceMember.display || getDisplay(resourceMember.name)) == columnSelected) columns.push(resourceMember); } ));
            return columns;
        }

        vm.getConstantFilters = function()
        {
            var filters = [];
            if (vm.pager.getConstantFilters())
                filters = filters.concat(vm.pager.getConstantFilters());
            if (vm.queryDetails.sort)
                filters = filters.concat(vm.queryDetails.sort);
            return filters;
        }

        function checkPermissions()
        {
            if (vm.hasPermissions.get()) {
                if (!vm.hasAllPermission.get()) {
                    if (!vm.hasAddPermission.get())
                        delete vm.componentConstruction.add;
                    if (!vm.hasEditPermission.get())
                        delete vm.componentConstruction.edit;
                    if (!vm.hasRemovePermission.get())
                        delete vm.componentConstruction.remove;
                    if (!vm.hasXlsSheetPermission.get())
                        vm.componentConstruction.canDownloadXlsSheet = false;
                    if (!vm.hasPdfPermission.get())
                        vm.componentConstruction.canDownloadPdf = false;
                }
            }
        }

        // =======================================================================================================================================================================
    };

    var component =
    {
        //templateUrl: 'src/shared/components/entifixTable/entifixTable.html',
        template: '<br/> \
                    <div ng-class="{\'whirl double-up whirlback\': bindCtrl.isChangingView}"> \
                        <md-card md-whiteframe="4" ng-if="bindCtrl.canSearch.get()" layout-padding layout="column"> \
                            <div ng-if="bindCtrl.isMovement.get()"> \
                                <div layout-xs="column" layout-gt-xs="column" layout-gt-sm="row" flex> \
                                    <div layout-xs="column" layout-gt-xs="row" flex> \
                                        <div flex> \
                                            <entifix-date-time-picker value-model="bindCtrl.startDate" component-construction="bindCtrl.startDateCC" on-change="bindCtrl.onChangeDateStart(value)"></entifix-date-time-picker> \
                                        </div> \
                                        <div flex> \
                                            <entifix-date-time-picker value-model="bindCtrl.endDate" component-construction="bindCtrl.endDateCC" on-change="bindCtrl.onChangeDateEnd(value)"></entifix-date-time-picker> \
                                        </div> \
                                    </div> \
                                    <div layout-xs="column" layout-gt-xs="row" flex> \
                                        <div flex layout layout-align="center center"> \
                                            <md-button class="md-primary text-success" ng-click="bindCtrl.searchItemsDate()" ng-disabled="!bindCtrl.startDate || !bindCtrl.endDate"> \
                                                <md-icon class="material-icons">{{bindCtrl.searchIcon.get()}}</md-icon> &nbsp;{{bindCtrl.searchText.get()}} \
                                            </md-button> \
                                        </div> \
                                        <div flex layout layout-align="center center"> \
                                            <entifix-checkbox-switch value-model="bindCtrl.notApplied" component-construction="bindCtrl.notAppliedCC" on-change="bindCtrl.onChangeNotApplied(value)"></entifix-checkbox-switch> \
                                        </div> \
                                    </div> \
                                </div> \
                            </div> \
                            <div layout-xs="column" layout-gt-xs="column" layout-gt-sm="row" flex ng-if="bindCtrl.customSearch"> \
                                <div layout-xs="column" layout-gt-xs="row" flex> \
                                    <div flex> \
                                        <md-input-container class="md-block"> \
                                            <label>{{bindCtrl.columnsText.get()}}</label> \
                                            <md-select \
                                                ng-model="bindCtrl.columnToSearch" \
                                                aria-label="{{bindCtrl.columnsText.get()}}" \
                                                ng-change="bindCtrl.onChangeColumn()"> \
                                                <md-option ng-repeat="item in bindCtrl.resourceMembers" ng-value="item">{{item.display}}</md-option> \
                                            </md-select> \
                                        </md-input-container> \
                                    </div> \
                                    <div flex> \
                                        <md-input-container class="md-block"> \
                                            <label>{{bindCtrl.operatorsText.get()}}</label> \
                                            <md-select \
                                                ng-model="bindCtrl.operator" \
                                                aria-label="{{bindCtrl.operatorsText.get()}}"> \
                                                <md-option ng-repeat="item in bindCtrl.operators" ng-value="item">{{item.display}}</md-option> \
                                            </md-select> \
                                        </md-input-container> \
                                    </div> \
                                </div> \
                                <div layout-sm="column" layout-gt-sm="row" flex> \
                                    <div flex> \
                                        <div ng-if="!bindCtrl.columnToSearch || bindCtrl.columnToSearch.type == \'text\' || bindCtrl.columnToSearch.type == \'entity\' || bindCtrl.columnToSearch.type == \'number\'" flex> \
                                            <entifix-input value-model="bindCtrl.valueToSearch" component-construction="bindCtrl.valueToSearchCC"></entifix-input> \
                                        </div> \
                                        <div ng-if="bindCtrl.columnToSearch.type == \'date\'" flex> \
                                            <entifix-date-time-picker value-model="bindCtrl.valueToSearch" component-construction="bindCtrl.valueToSearchCC"></entifix-date-time-picker> \
                                        </div> \
                                        <div ng-if="bindCtrl.columnToSearch.type == \'datetime\'" flex> \
                                            <entifix-date-time-picker value-model="bindCtrl.valueToSearch" component-construction="bindCtrl.valueToSearchDTCC"></entifix-date-time-picker> \
                                        </div> \
                                        <div ng-if="bindCtrl.columnToSearch.type == \'enum\'" flex> \
                                            <entifix-autocomplete value-model="bindCtrl.valueToSearch" component-construction="bindCtrl.valueToSearchCC" query-details="bindCtrl.valueToSearchQD" component-binding-out="bindCtrl.valueToSearchE"></entifix-autocomplete> \
                                        </div> \
                                        <div ng-if="bindCtrl.columnToSearch.type == \'boolean\'" flex> \
                                            <entifix-select value-model="bindCtrl.valueToSearch" component-construction="bindCtrl.valueToSearchCC" component-binding-out="bindCtrl.valueToSearchE"></entifix-select> \
                                        </div> \
                                    </div> \
                                    <div flex layout layout-align="center center"> \
                                        <md-button class="md-primary text-success" ng-click="bindCtrl.addChip()" ng-disabled="!bindCtrl.columnToSearch || !bindCtrl.operator || !bindCtrl.valueToSearch"> \
                                            <md-icon class="material-icons">{{bindCtrl.searchIcon.get()}}</md-icon> &nbsp;{{bindCtrl.addFilterText.get()}} \
                                        </md-button> \
                                    </div> \
                                </div> \
                            </div> \
                            <div layout-xs="column" layout-gt-xs="column" layout-gt-sm="row" flex> \
                                <div layout-xs="column" layout-gt-xs="row" flex-xs="100" flex-gt-sm="75"> \
                                    <div flex ng-if="!bindCtrl.customSearch"> \
                                        <md-input-container class="md-block"> \
                                            <label>{{bindCtrl.searchText.get()}}</label> \
                                            <input type="text" ng-model="bindCtrl.textBoxSearchValue" ng-keypress="bindCtrl.keypressTextBoxSearch($event)" ng-change="bindCtrl.onChangeSearch()"> \
                                        </md-input-container> \
                                    </div> \
                                    <div flex ng-if="bindCtrl.customSearch"> \
                                        <entifix-chip value-model="bindCtrl.textBoxSearchValueChips" component-construction="bindCtrl.chipsCC"></entifix-chip> \
                                    </div> \
                                </div> \
                                <div layout-xs="column" layout-gt-xs="row" flex-xs="100" flex-gt-sm="25" ng-if="bindCtrl.allowCustomSearch.get()"> \
                                    <div flex layout layout-align="center center"> \
                                        <div flex layout layout-align="center center"> \
                                            <entifix-checkbox-switch value-model="bindCtrl.customSearch" component-construction="bindCtrl.customSearchCC" on-change="bindCtrl.onChangeSwitch(v)"></entifix-checkbox-switch> \
                                        </div> \
                                    </div> \
                                </div> \
                            </div> \
                        </md-card> \
                        <div layout="column"> \
                            <md-card md-whiteframe="4"> \
                                <md-content layout-padding> \
                                    <div layout="column"> \
                                        <div flex layout-align="end center"> \
                                            <section layout-xs="column" layout="row" layout-align="end center"> \
                                                <div> \
                                                    <md-button class="md-primary text-success" ng-click="bindCtrl.addElement()" ng-disabled="!(bindCtrl.canAdd.get() && !bindCtrl.multipleAddOptions.get())" ng-if="bindCtrl.componentConstruction.add"> \
                                                        <md-icon class="material-icons">{{bindCtrl.addIcon.get()}}</md-icon> &nbsp;{{bindCtrl.addText.get()}} \
                                                    </md-button> \
                                                    <md-button class="md-warn text-danger" ng-click="bindCtrl.removeElement()" ng-disabled="!(bindCtrl.canRemove.get() && !bindCtrl.multipleRemoveOptions.get())"  ng-if="bindCtrl.componentConstruction.remove"> \
                                                        <md-icon class="material-icons">{{bindCtrl.removeIcon.get()}}</md-icon> &nbsp;{{bindCtrl.removeText.get()}} \
                                                    </md-button> \
                                                    <md-button class="md-accent text-warning" ng-click="bindCtrl.editElement()" ng-disabled="!(bindCtrl.canEdit.get() && !bindCtrl.multipleEditOptions.get())" ng-if="bindCtrl.componentConstruction.edit"> \
                                                        <md-icon class="material-icons">{{bindCtrl.editIcon.get()}}</md-icon> &nbsp;{{bindCtrl.editText.get()}} \
                                                    </md-button> \
                                                    <md-menu md-position-mode="target-right target" ng-click="bindCtrl.openXlsSheetMenu($mdMenu, $event)" ng-if="bindCtrl.canDownloadXlsSheet.get()"> \
                                                        <md-button class="md-primary text-success md-fab md-mini" ng-click="bindCtrl.ds()"> \
                                                            <md-tooltip>{{bindCtrl.xlsSheetText.get()}}</md-tooltip> \
                                                            <md-icon class="material-icons">{{bindCtrl.xlsSheetIcon.get()}}</md-icon> \
                                                        </md-button> \
                                                        <md-menu-content> \
                                                            <md-menu-item> \
                                                                <md-button aria-label="" ng-click="bindCtrl.downloadFileAllPages(\'xls\')"> \
                                                                    <md-tooltip>{{bindCtrl.allPagesText.get()}}</md-tooltip> \
                                                                    <md-icon class="material-icons">filter_none</md-icon>{{bindCtrl.allPagesText.get()}} \
                                                                </md-button> \
                                                            </md-menu-item> \
                                                            <md-menu-divider></md-menu-divider> \
                                                            <md-menu-item> \
                                                                <md-button aria-label="" ng-click="bindCtrl.downloadFileSimplePage(\'xls\')"> \
                                                                    <md-tooltip>{{bindCtrl.currentPageText.get()}}</md-tooltip> \
                                                                    <md-icon class="material-icons">filter_1</md-icon>{{bindCtrl.currentPageText.get()}} \
                                                                </md-button> \
                                                            </md-menu-item> \
                                                        </md-menu-content> \
                                                    </md-menu> \
                                                    <md-menu md-position-mode="target-right target" ng-click="bindCtrl.openPdfMenu($mdMenu, $event)" ng-if="bindCtrl.canDownloadPdf.get()"> \
                                                        <md-button class="md-primary md-warn text-danger md-fab md-mini" ng-click="bindCtrl.ds()"> \
                                                            <md-tooltip>{{bindCtrl.pdfText.get()}}</md-tooltip> \
                                                            <md-icon class="material-icons">{{bindCtrl.pdfIcon.get()}}</md-icon> \
                                                        </md-button> \
                                                        <md-menu-content> \
                                                            <md-menu-item> \
                                                                <md-button aria-label="" ng-click="bindCtrl.downloadFileAllPages(\'pdf\')"> \
                                                                    <md-tooltip>{{bindCtrl.allPagesText.get()}}</md-tooltip> \
                                                                    <md-icon class="material-icons">filter_none</md-icon>{{bindCtrl.allPagesText.get()}} \
                                                                </md-button> \
                                                            </md-menu-item> \
                                                            <md-menu-divider></md-menu-divider> \
                                                            <md-menu-item> \
                                                                <md-button aria-label="" ng-click="bindCtrl.downloadFileSimplePage(\'pdf\')()"> \
                                                                    <md-tooltip>{{bindCtrl.currentPageText.get()}}</md-tooltip> \
                                                                    <md-icon class="material-icons">filter_1</md-icon>{{bindCtrl.currentPageText.get()}} \
                                                                </md-button> \
                                                            </md-menu-item> \
                                                        </md-menu-content> \
                                                    </md-menu> \
                                                </div> \
                                            </section> \
                                        </div> \
                                        <div class="md-table-head" layout> \
                                            <div flex flex-gt-md="65" layout layout-align="start center" ng-if="bindCtrl.selectColumns.get()"> \
                                                <md-input-container> \
                                                    <label>{{bindCtrl.columnsText.get()}}</label> \
                                                    <md-select \
                                                        ng-model="bindCtrl.columnsSelected" \
                                                        multiple \
                                                        aria-label="{{bindCtrl.columnsText.get()}}" \
                                                        ng-change="bindCtrl.reloadAllSelected()"> \
                                                        <md-option ng-click="bindCtrl.selectAllItems()">{{bindCtrl.selectAllText.get()}}</md-option> \
                                                        <md-option ng-repeat="item in bindCtrl.resourceMembers">{{item.display}}</md-option> \
                                                    </md-select> \
                                                </md-input-container> \
                                            </div> \
                                            <div flex layout layout-align="end center"> \
                                                <md-input-container ng-show="bindCtrl.pager.showPageControls.get()"> \
                                                    <md-select \
                                                        ng-model="bindCtrl.pager.size" \
                                                        ng-change="bindCtrl.onChangePageSize()" \
                                                        aria-label="Page Controls"> \
                                                        <md-option ng-repeat="optionSize in bindCtrl.pager.pageSizes" ng-value="optionSize">{{optionSize}}</md-option> \
                                                    </md-select> \
                                                </md-input-container> \
                                            </div> \
                                        </div> \
                                        <div class="md-table-container"> \
                                            <div compile="bindCtrl.stringhtmlcomponent"></div> \
                                        </div> \
                                        <br/> \
                                        <div layout-xs="column" layout-md="row" layout-lg="row" layout-xl="row"> \
                                            <div flex flex-md="35" flex-md="35" flex-lg="30" flex-xl="35"> \
                                                <h5>{{bindCtrl.pager.getDescriptionText()}}</h5> \
                                            </div> \
                                            <div flex layout layout-align="end center"> \
                                                <grid-pagination \
                                                    max-size="10" \
                                                    boundary-links="true" \
                                                    class="pagination mdl-shadow--2dp" \
                                                    ng-if="bindCtrl.pager.totalData > bindCtrl.pager.size" \
                                                    total-items="bindCtrl.pager.totalData" \
                                                    ng-model="bindCtrl.pager.page" \
                                                    ng-change="bindCtrl.onChangePage()" \
                                                    items-per-page="bindCtrl.pager.size"> \
                                                </grid-pagination> \
                                            </div> \
                                        </div> \
                                    </div> \
                                </md-content> \
                            </md-card> \
                        </div> \
                    </div>',
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
    module.component('entifixTable', component);
})();
