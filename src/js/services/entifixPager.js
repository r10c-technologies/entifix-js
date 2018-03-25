
(function(){
    'use strict';

    angular.module('entifix-js').factory('EntifixPager', factory);

    factory.$inject = ['EntifixCollectionFormatter'];

    function factory (EntifixCollectionFormatter)
    {
        return function(queryDetails, configuration, formats)
        {
            var vm = this;

            // Properties and fields
            // =========================================================================================================================

            // Fields
            
            var _isLoading = false;
            var _actionPreload;
            var _actionPostload;
            var _searchTextGetter;
            var _searchArrayGetter;
            var _columnsSelectedGetter;
            var _sizeGetter;
            var _pageGetter;
            var _inverseOrder
            var _paginationSetter;
            // Properties
            
            vm.isLoading = 
            {
                get: () => { return _isLoading; }
            };

            vm.sizeGetter = 
            {
                get: () => { return _sizeGetter; },
                set: (value) => { _sizeGetter = value; }
            };

            vm.pageGetter = 
            {
                get: () => { return _pageGetter; },
                set: (value) => { _pageGetter = value; }
            };
            
            vm.searchTextGetter = 
            {
                get: () => { return _searchTextGetter; },
                set: (value) => { _searchTextGetter = value; }
            };
            
            vm.searchArrayGetter = 
            {
                get: () => { return _searchArrayGetter; },
                set: (value) => { _searchArrayGetter = value; }
            };
            
            vm.columnsSelectedGetter = 
            {
                get: () => { return _columnsSelectedGetter; },
                set: (value) => { _columnsSelectedGetter = value; }
            };

            vm.inverseOrder = 
            {
                get: () => { return _inverseOrder; },
                set: (value) => { _inverseOrder = value; }
            };

            vm.showPageControls =
            {
                get: () =>
                {
                    if (configuration && configuration.showPageControls != null)
                        return configuration.showPageControls;

                    if (vm.currentData && vm.currentData.length && vm.currentData.length > 0)
                        return true;
                    return false;
                }
            };

            var inicialSize =
            {
                get: () =>
                {
                    if (configuration && configuration.inicialSize)
                        return configuration.inicialSize;
                    return 10;
                }
            };

            var inicialPageSizes =
            {
                get: () =>
                {
                    if (configuration && configuration.inicialPageSizes)
                        return configuration.inicialPageSizes;
                    return [10, 25, 50, 100, 200];
                }
            }

            var inicialCurrentPage =
            {
                get: () =>
                {
                    if (configuration && configuration.inicialCurrentPage)
                        return configuration.inicialCurrentPage;
                    return 1;
                }
            }

            // =========================================================================================================================


            // Methods
            // =========================================================================================================================

            function activate()
            {
                vm.pageSizes = inicialPageSizes.get();
                vm.size = inicialSize.get();
                vm.page = inicialCurrentPage.get();
                vm.formater = new EntifixCollectionFormatter();
            };

            vm.listenBeforeLoad = function(callback)
            {
                _actionPreload = callback;
            };

            vm.listenAfterLoad = function(callback)
            {
                _actionPostload = callback;
            };

            vm.reload = function()
            {
                return requestData();
            };

            function requestData()
            {
                if (queryDetails.resource)
                {
                    _isLoading = true;

                    if (_actionPreload)
                        _actionPreload();
                    
                    return queryDetails.resource
                        .getEntityPagination( (vm.getPage()-1) * vm.getSize(), vm.getSize(), vm.getConstantFilters(), queryDetails.resource.getPagFilters(vm.getSearchText(), vm.getSearchArray(), vm.getColumnsSelectedGetter()), queryDetails.sort)
                        .then(  (data) => 
                                {
                                    if (data)
                                    {
                                        var total = data.total;
                                        var page = vm.getPage();
                                        var size = vm.getSize();
                                        for (var i = 1; i <= vm.getSize(); i++)
                                        {
                                            if (_inverseOrder)
                                            {
                                                var res = total - (page-1) * size;
                                                var ord = total - (page-1) * size - res - i;
                                                if (ord > 0)
                                                    data.resultSet[i].order = ord;
                                            }
                                            else
                                            {
                                                var ord = (page-1) * size + i;
                                                if (ord <= total)
                                                {
                                                    if (data.resultSet[i-1])
                                                        data.resultSet[i-1].order = ord;
                                                    else
                                                        console.info("Error en la paginación de registros. No concuerdan el total en el encabezado y la cantidad registros en el detalle");                                                              
                                                }
                                            }
                                        }

                                        // Set pagination
                                        vm.formater.transformMultiple({collection: data.resultSet, properties: formats}).then(() => { vm.currentData = data.resultSet });
                                        vm.currentData = data.resultSet;
                                        vm.totalData = data.total;

                                        if (_actionPostload)
                                            _actionPostload();
                                    }
                                    _isLoading = false;
                                },
                                (error)=> { _isLoading = false; return error; });
                } 
                else
                {
                    console.error('No se ha construido correctamente el paginador');
                }
            };

            vm.getSize = function()
            {
                if (_sizeGetter)
                    return _sizeGetter();

                if (vm.size)
                    return vm.size;

                return 10;                
            };

            vm.getPage = function()
            {
                if (_pageGetter)
                    return _pageGetter();

                if (vm.page)
                    return vm.page;

                return 1;                
            };
            
            vm.getConstantFilters = function()
            {
                var constantFilters = null;
                if (queryDetails && queryDetails.constantFilters)
                {
                    if (queryDetails.constantFilters.getter)
                        constantFilters = queryDetails.constantFilters.getter();
                    else
                        constantFilters = queryDetails.constantFilters;                    
                }

                return constantFilters;                
            };

            vm.getSearchText = function() 
            {
                if (_searchTextGetter)
                    return _searchTextGetter();

                if (vm.searchText)
                    return vm.searchText;

                return null;
            };

            vm.getSearchArray = function() 
            {
                if (_searchArrayGetter)
                    return _searchArrayGetter();

                if (vm.searchArray)
                    return vm.searchArray;

                return null;
            };

            vm.getColumnsSelectedGetter = function() 
            {
                if (_columnsSelectedGetter)
                    return _columnsSelectedGetter();

                if (vm.columnsSelected)
                    return vm.columnsSelected;

                return null;
            };

            vm.getDescriptionText = function()
            {
                if (vm.currentData && vm.currentData.length > 0)
                {
                    var start = (vm.getPage() - 1) * vm.getSize() + 1;
                    var end =  start + vm.currentData.length - 1;

                    return 'Mostrando del ' + start + ' al ' + end + ' de ' + vm.totalData + ' registros';
                }

                return 'No hay registros que mostrar';
            };

            vm.sortTableColumns = 
            {
                set: (filters) => { if (filters) queryDetails.sort = filters; }
            }
            
            // =========================================================================================================================

            // Constructor call
            activate();
        };
    };

})();