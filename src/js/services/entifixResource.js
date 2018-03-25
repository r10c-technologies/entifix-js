(function(){
    'use strict';

    angular
        .module('entifix-js')
        .factory('EntifixResource', resource);

    resource.$inject = ['$http', 'AppResources', 'EntifixMetadata', 'EntifixErrorManager'];

    function resource($http, AppResources, EntifixMetadata, EntifixErrorManager)
    {
        var resource = function(resourceName)
        {
            var vm = this;

            // REQUESTS _____________________________________________________________________________________________________________________________________________________________________
            //==============================================================================================================================================================================

            var GET = (actionSuccess, actionError, stringQueryParams, suffixUrl, returnPromise) =>
            {                
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                if (suffixUrl)
                    tempUrl = tempUrl + '/'+ suffixUrl;

                if (stringQueryParams)
                    tempUrl = tempUrl + stringQueryParams;

                actionError = actionError || _defaultActionError;

                var requestConfig =
                {
                    method: 'GET',
                    url: tempUrl
                };

                if (returnPromise)
                    return $http(requestConfig);
                else
                    $http(requestConfig).then(actionSuccess, actionError);
            };

            var POST = (data, actionSuccess, actionError) =>
            {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                actionError = actionError || _defaultActionError;

                if (isFormDataRequest())
                {
                    data = transformDataToRequest(data);
                    $http({
                            method: 'POST',
                            url: tempUrl,
                            data: convertData(data),
                            headers : {'Content-Type': undefined} 
                        }).then(actionSuccess, actionError);
                }
                else
                {
                    $http({
                            method: 'POST',
                            url: tempUrl,
                            data: transformDataToRequest(data)
                        }).then(actionSuccess, actionError);
                }
            };

            var PUT = (data, actionSuccess, actionError) =>
            {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                actionError = actionError || _defaultActionError;

                if (isFormDataRequest())
                {
                    data = transformDataToRequest(data);
                    $http({
                            method: 'PUT',
                            url: tempUrl,
                            data: convertData(data),
                            headers : {'Content-Type': undefined} 
                        }).then(actionSuccess, actionError);
                }
                else
                {
                    $http({
                            method: 'PUT',
                            url: tempUrl,
                            data: transformDataToRequest(data)
                        }).then(actionSuccess, actionError);
                }
            };

            var DELETE = (id, actionSuccess, actionError) =>
            {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                var tempUrl = tempUrl + '/' + id;
                actionError = actionError || _defaultActionError;   

                $http({
                        method: 'DELETE',
                        url: tempUrl
                    }).then(actionSuccess, actionError);
            };

            var PATCH = (data, actionSuccess, actionError) =>
            {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                actionError = actionError || _defaultActionError;

                if (isFormDataRequest())
                {
                    data = transformDataToRequest(data);
                    $http({
                            method: 'PATCH',
                            url: tempUrl,
                            data: convertData(data),
                            headers : {'Content-Type': undefined} 
                        }).then(actionSuccess, actionError);
                }
                else
                {
                    $http({
                            method: 'PATCH',
                            url: tempUrl,
                            data: transformDataToRequest(data)
                        }).then(actionSuccess, actionError);
                }
            };

            //Format functions ===>>>>:

            function getBaseUrl()
            {
                var tempUrl = AppResources.baseUrl + AppResources.api;

                var prefix = vm.urlPrefix.get();

                if (prefix)
                {
                    tempUrl += prefix;
                    if (!_denyBarPrefix)
                        tempUrl += '/';                    
                }

                return tempUrl + _resourceUrl;
            };

            function transformDataToRequest (data)
            {
                //Set type
                var typeInfo = EntifixMetadata.getTypeInfo(resourceName);
                if (typeInfo && data[typeInfo.property] && data[_keyProperty])
                    data[typeInfo.property] = { [typeInfo.property]: typeInfo.value };
                
                //Transform properties
                var transformProperties = EntifixMetadata.getTransformProperties(resourceName);
                if (transformProperties.length > 0)
                {
                    for (var i = 0; i < transformProperties.length; i++)
                    {
                        var TProperty = transformProperties[i];
                        
                        if (data[TProperty.name])
                        {
                            //For navigation properties
                            if (TProperty.transformType == 'navigation')
                            {
                                var value = data[TProperty.name];
                                
                                if (!isNaN(value))
                                {
                                    var keyValue = value;
                                    var keyNavigationProperty = TProperty.keyNavigationProperty || EntifixMetadata.getKeyProperty(TProperty.resource);
                                    data[TProperty.name] = { [keyNavigationProperty]: keyValue } 
                                }                                                                
                            }

                            //For date properties
                            if (TProperty.transformType == 'date' || TProperty.transformType == 'datetime')
                            {
                                var dateValue = new Date(data[TProperty.name]);

                                var year = dateValue.getFullYear().toString();
                                var month = (dateValue.getMonth() + 1).toString();
                                var day = dateValue.getDate().toString();
                                var hours = dateValue.getHours().toString();
                                var minutes = dateValue.getMinutes().toString();
                                var seconds = dateValue.getSeconds().toString();

                                if (month.length < 2)
                                    month = '0' + month;
                                if (day.length < 2)
                                    day = '0' + day;
                                if (hours.length < 2)
                                    hours = '0' + hours;
                                if (minutes.length < 2)
                                    minutes = '0' + minutes;
                                if (seconds.length < 2)
                                    seconds = '0' + seconds;
                                
                                data[TProperty.name] = year + '-' +  month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
                            }

                            //Other types of properties to transform....

                            /*if (TProperty.propertyMetaData.transformType == ?)
                            {

                            }*/
                        }

                    }
                }


                //Remove non persistent and excluded properties/members
                for(var p in data)
                {
                    if (p.substr(0,1) == '$')
                        delete(data[p]);
                };
                var excludedMembers = EntifixMetadata.getExcludedMembers(resourceName);
                for (var i = 0; i < excludedMembers.length; i++)
                    delete(data[excludedMembers[i]]);
                
                return data;
            };

            function convertData (data)
            {
                var fd = new FormData();
                for (var p in data)
                    fd.append(p, data[p]);
                return fd;
            }
            
            function transformDataFromResponse(data)
            {
                if (data)
                {
                    //Transform properties
                    var transformProperties = EntifixMetadata.getTransformProperties(resourceName);

                    if (transformProperties.length > 0)
                    {
                        for(var i = 0; i < transformProperties.length; i++)
                        {
                            var TProperty = transformProperties[i];
                            
                            if (data[TProperty.name])
                            {
                                //For navigation properties
                                if (TProperty.transformType == 'navigation')
                                {   
                                    var objectValue = data[TProperty.name];
                                    var keyNavigationProperty = TProperty.keyNavigationProperty || EntifixMetadata.getKeyProperty(TProperty.resource);
                                    var keyValue = objectValue[keyNavigationProperty];

                                    if (TProperty.propertiesToMembers)
                                        for (var j=0; j < TProperty.propertiesToMembers.length; j++)
                                            if (TProperty.propertiesToMembers[j] instanceof Object)
                                                data[TProperty.propertiesToMembers[j].to || TProperty.propertiesToMembers[j].name] = objectValue[TProperty.propertiesToMembers[j].name];

                                    data[TProperty.name] = keyValue;
                                }

                                //For date-time properties
                                if (TProperty.transformType == 'date' || TProperty.transformType == 'datetime')
                                {   
                                    var objectValue = data[TProperty.name];
                                    data[TProperty.name] = new Date(objectValue);
                                }

                                //Other types of properties to transform....
                                /*if (TProperty.propertyMetaData.transformType == ?)
                                {

                                }*/
                            }
                        }
                    }

                    return data;
                }
                else
                    return null;
            };

            //==============================================================================================================================================================================





            // Properties and Fields _______________________________________________________________________________________________________________________________________________________            
            //==============================================================================================================================================================================

            //Fields ===>>>>:
            var _isSaving = false;
            var _isLoading = false;
            var _isDeleting = false;
            var _events = null;
            var _onMultipleDeletion = false;
            var _onMultipleStorage = false;
            var _urlPrefix;

            var _resourceUrl = EntifixMetadata.getResourceURL(resourceName);
            var _keyProperty = EntifixMetadata.getKeyProperty(resourceName);
            var _opProperty = EntifixMetadata.getOpProperty(resourceName);
            var _allowUrlPrefix = EntifixMetadata.allowUrlPrefix(resourceName);
            var _denyBarPrefix = EntifixMetadata.denyBarPrefix(resourceName);
            
            var _defaultActionError = (error) => 
            {
                _isDeleting = false;
                _isLoading = false;
                _isSaving = false;
            };

            var _checkActionErrors = (error) =>
            {
                switch (error.status)
                {
                    case 401:   
                        EntifixErrorManager.unauthorizedError(error);
                        break;

                    case 404:
                        EntifixErrorManager.notFoundError(error);
                        break;

                    case 412:
                        EntifixErrorManager.preconditionFailedError(error);
                        break;

                    case 500:
                        EntifixErrorManager.internalServerError(error);
                        break;
                }
            }

            var _eventType = { save: 1, delete: 2, load: 3, saved: 4, deleted: 5, loaded: 6, errorSave: 7, errorDelete: 8, errorLoad: 9, nonValidSave: 10 };

            //Properties ===>>>>:
            vm.resourceName =
            {
                get: () => { return resourceName; }                
            };
            
            vm.isSaving =
            {
                get: () => { return _isSaving || _onMultipleStorage; }                
            };

            vm.isLoading =
            {
                get: ()  => { return _isLoading; }
            };

            vm.isDeleting = 
            {
                get: () => { return _isDeleting || _onMultipleDeletion; }
            }; 
            
            vm.events =
            {
                get: () => { return _events; }
            };

            vm.onMultipleDeletion =
            {
                get: () => { return _onMultipleDeletion; },
                set: (value) => { _onMultipleDeletion = value; }
            };

            vm.onMultipleStorage =
            {
                get: () => { return _onMultipleStorage; },
                set: (value) => { _onMultipleStorage = value; }
            };
            
            vm.urlPrefix = 
            {
                get: () => 
                { 
                    if (_allowUrlPrefix && _urlPrefix)
                    {
                        if (_urlPrefix instanceof Object && _urlPrefix.getter)
                            return _urlPrefix.getter();
                        
                        if (_urlPrefix)
                            return _urlPrefix;
                    }

                    return null; 
                },
                set: (value) => 
                { 
                    if (_allowUrlPrefix)
                        _urlPrefix = value;
                }
            }

            vm.getCompleteResourceUrl =
            {
                get: () =>
                {
                    return getBaseUrl();
                }
            }

            vm.getCompleteFiltersUrl =
            {
                get: (searchText, searchArray, columnsSelected, constantFilters) =>
                {
                    if (!constantFilters)
                        constantFilters = [];
                    return manageUriFilter(vm.getPagFilters(searchText, searchArray, columnsSelected).concat(constantFilters));
                }
            }

            vm.getMembersResource = 
            {
                get: () =>
                {
                    return EntifixMetadata.getResourceProperties(resourceName).filter((rp)=>{ return !rp.notDisplay});
                }
            }

            vm.getKeyProperty = 
            {
                get: () =>
                {
                    return _keyProperty;
                }
            }

            vm.getOpProperty = 
            {
                get: () =>
                {
                    return _opProperty;
                }
            }
            //==============================================================================================================================================================================





            // Methods _____________________________________________________________________________________________________________________________________________________________________
            //==============================================================================================================================================================================



            //Private ===>>>>:

            //Manage request timing
            function createArgs(response)
            {
                return { friendlyMessage: response.data.friendlyMessage, fullResponse: response };
            };
            
            function onSaveTransactionEnd(callback, isError)
            {
                return (response) => 
                {
                    var saveSuccess = !response.data.isError;
                    
                    if (!_onMultipleStorage && callback)
                        callback(response, saveSuccess);
                    
                    _isSaving = false;

                    if (!(response.status >= 200 && response.status < 300))
                        _checkActionErrors(response);

                    if (isError) 
                        runTriggers(_eventType.errorSave, createArgs(response));
                    else if (!_onMultipleStorage)
                    {
                        if (saveSuccess)
                            runTriggers(_eventType.saved, createArgs(response));
                        else
                            runTriggers(_eventType.nonValidSave, createArgs(response));
                    }
                        
                    if (_onMultipleStorage && callback)
                        callback(response);
                };
            };

            function onQueryEnd(callback, isError)
            {
                return (response) =>
                {
                    if (callback)
                        callback(response);
                    
                    _isLoading = false;

                    if (!(response.status >= 200 && response.status < 300))
                        _checkActionErrors(response);

                    if (isError)
                        runTriggers(_eventType.errorLoad, createArgs(response));
                    else
                        runTriggers(_eventType.loaded, createArgs(response));
                };
            };

            function onDeleteTransactionEnd(callback, isError)
            {
                return (response) => 
                {
                    if (!_onMultipleDeletion && callback)
                        callback(response);

                    _isDeleting = false; 

                    if (!(response.status >= 200 && response.status < 300))
                        _checkActionErrors(response);

                    if (isError) 
                        runTriggers(_eventType.errorDelete, createArgs(response));
                    else if (!_onMultipleDeletion)
                        runTriggers(_eventType.deleted, createArgs(response));

                    if (_onMultipleDeletion && callback)
                        callback(response);
                };
            };

            // Base functions for requests
            function _deleteEntity (idEntity, actionSuccess, actionError)
            {
                if (_isDeleting != true || _onMultipleDeletion)
                {
                    _isDeleting = true;
                    runTriggers(_eventType.delete);

                    DELETE(idEntity, onDeleteTransactionEnd(actionSuccess, false), onDeleteTransactionEnd(actionError, true));
                }
            };

            function _insertEntity (entity, actionSuccess, actionError)
            {
                if (_isSaving != true || _onMultipleStorage)
                {
                    _isSaving = true;
                    runTriggers(_eventType.save);

                    POST(entity, onSaveTransactionEnd(actionSuccess, false), onSaveTransactionEnd(actionError, true));
                }
            };

            function _updateEntity (entity, actionSuccess, actionError)
            {
                if (_isSaving != true || _onMultipleStorage)
                {
                    _isSaving = true;
                    runTriggers(_eventType.save);
                    
                    PUT(entity, onSaveTransactionEnd(actionSuccess, false), onSaveTransactionEnd(actionError, true));
                }                    
            };

            function _replaceEntity (entity, actionSuccess, actionError)
            {
                if (_isSaving != true || _onMultipleStorage)
                {
                    _isSaving = true;
                    runTriggers(_eventType.save);
                    
                    PATCH(entity, onSaveTransactionEnd(actionSuccess, false), onSaveTransactionEnd(actionError, true));
                }                    
            };

            function findEntity(id, ActionSuccess, ActionError)
            {
                _isLoading = true;

                var preSuccess = (response) =>
                {                    
                    _isLoading = true;

                    if (ActionSuccess)
                        ActionSuccess(transformDataFromResponse(response.data.data[0]));
                    
                    _isLoading = false;
                } 

                GET(onQueryEnd(preSuccess), onQueryEnd(ActionError), manageUriFilter(id));
            };

            function convertToQueryParams(filters)
            {
                if (filters)
                {
                    if (filters instanceof Array)
                    {
                        if (filters.length > 0)
                        {
                            var querystring= '?';
                            for(var i = 0; i < filters.length; i++)
                            {
                                var property = filters[i].property;
                                var value = filters[i].value;
                                if (value != null && property != null)
                                {
                                    //Function filters
                                    if (typeof value == "function")
                                    {
                                        var possibleValue = value();
                                        if (possibleValue)
                                            querystring = querystring + property + '=' + possibleValue;
                                    }                                        
                                    
                                    //Clasic filters
                                    else 
                                        querystring = querystring + property + '=' + value;
                                    
                                    //Other types of filters
                                    /*
                                    if/else (...)
                                    {

                                    }
                                    */
                                }

                                if (i < filters.length-1 )
                                    querystring = querystring + '&';
                            }

                            return querystring;
                        }
                        else
                            return null;
                    }
                }
                
                return null;
            };

            function manageUriFilter(filter)
            {
                if (filter)
                {
                    var stringfilter = null;

                    if (!isNaN(filter))
                        stringfilter = '/' + filter;
                    
                    else if  ( typeof filter == 'string')
                        stringfilter = filter;
                    
                    else if (filter instanceof Array)
                        stringfilter = convertToQueryParams(filter);

                    return stringfilter;
                }

                return null;
            }
            


            //Public ===>>>>:

            vm.getCollection = function(actionSuccess, actionError, filters, suffix_pagination)
            {
                _isLoading = true;

                actionError = actionError || _defaultActionError;
                
                var tempSuffix = null;
                if (suffix_pagination)
                {
                    if (suffix_pagination instanceof Function)
                        tempSuffix = suffix_pagination();
                    else
                        tempSuffix = suffix_pagination.skip + '/' + suffix_pagination.take;
                }                    

                var preSuccess = (response) =>
                {
                    _isLoading = true;
                    var resultData = response.data.data || [];
                    actionSuccess(resultData);
                    _isLoading = false;            
                }; 

                GET(onQueryEnd(preSuccess), onQueryEnd(actionError), manageUriFilter(filters), tempSuffix);
            };
            
            vm.getEnumerationBind = function (DisplayProperty, actionSuccess, actionError, filters)
            {
                var operateresults = function (results)
                {
                    var bindEnum = [];
                    
                    results.forEach(function (element)
                    {
                        bindEnum.push({ Value: element[_keyProperty], Display: element[DisplayProperty], ObjectData: element });
                    });                    
                    
                    actionSuccess(bindEnum);
                };
                
                return vm.getCollection(operateresults, actionError, filters);
            };
            
            vm.getEnumerationBindMultiDisplay = function (parameters)
            {
                var operateresults = function (results)
                {
                    var bindEnum = [];
                    
                    results.forEach(function (element)
                    {
                        if (parameters.displayProperties)
                        {
                            var value = "";
                            parameters.displayProperties.forEach(function (displayProperty)
                            {
                                if (displayProperty.type)
                                    value += element[displayProperty.property][displayProperty.display] + " - ";
                                else
                                    value += element[displayProperty.property] + " - ";
                            });
                            value = value.substring(0, value.length - 2)
                            bindEnum.push({ Value: element[_keyProperty], Display: value, ObjectData: element });
                        }
                    });                    
                    
                    parameters.actionSuccess(bindEnum);
                };
                
                return vm.getCollection(operateresults, parameters.actionError, parameters.filters);
            };
            
            vm.getDefault = function (actionSuccess, actionError)
            {
                var defaultURL = EntifixMetadata.getDefaultUrl(resourceName);

                _isLoading = true;

                actionError = actionError || _defaultActionError;
                
                var preSuccess = (response) =>
                {
                    _isLoading = true;
                    var resultData = response.data.data || [];
                    actionSuccess(resultData);
                    _isLoading = false;          
                }; 

                GET(onQueryEnd(preSuccess), onQueryEnd(actionError), null, defaultURL);                
            };  
            
            vm.saveEntity = function (entity, ActionSuccess, ActionError)
            {
                if (entity[_keyProperty])
                {
                    if (entity[_opProperty])
                        _replaceEntity(entity, ActionSuccess, ActionError);
                    else 
                        _updateEntity(entity, ActionSuccess, ActionError);
                }
                else
                    _insertEntity(entity, ActionSuccess, ActionError);
            };

            vm.deleteEntity = function(entity, actionSuccess, actionError)
            {
                var id = entity;

                if (entity instanceof Object)
                    id  =  entity[_keyProperty];
                
                _deleteEntity(id, actionSuccess, actionError)
            };

            vm.loadAsResource = function (entity, ActionSuccess, ActionError)
            {
                var id = entity;

                if (entity instanceof Object)
                    id  =  entity[_keyProperty];
                                
                findEntity(id, ActionSuccess, ActionError);
            };           

            vm.getEntityPagination = function (pageIndex, pageSize, constFilters, pagFilters, sort)
            {
                _isLoading = true;

                var pagUrl = + pageIndex + '/' + pageSize;

                var allFilters = [];

                if (constFilters)
                {
                    if (constFilters instanceof String)
                        pagUrl = constFilters + '/' + pagUrl;
                    if (constFilters instanceof Function)
                        pagUrl = constFilters() ? constFilters() + '/' + pagUrl : pagUrl;
                    if (constFilters instanceof Array && constFilters.length > 0)
                        allFilters = allFilters.concat(constFilters);
                }
                
                if (pagFilters && pagFilters.length > 0)
                    allFilters = allFilters.concat(pagFilters);

                if (sort && sort.length > 0)
                    allFilters = allFilters.concat(sort);

                return GET(null, null, manageUriFilter(allFilters), pagUrl, true).then( (response) => 
                                                                                        {
                                                                                            var dataPag =
                                                                                            {
                                                                                                resultSet: response.data.data,
                                                                                                total: parseInt(response.data.results)
                                                                                            }
                                                                                            _isLoading = false;
                                                                                            return dataPag;
                                                                                        },
                                                                                        (error) => 
                                                                                        {
                                                                                            _isLoading = false; 
                                                                                            _checkActionErrors(error);
                                                                                        });
            };

            vm.getPagFilters = function(searchText, searchArray, columnsSelected)
            {
                if (searchText && (!searchArray || searchArray.length <= 0))
                {
                    var pagProperties = filterProperties(EntifixMetadata.getPaginableProperties(resourceName), columnsSelected).map( (p)=>{ return (p.pageProperty ? p.pageProperty : p.name); } );
                    var joinProperties = filterProperties(EntifixMetadata.getJoinProperties(resourceName), columnsSelected);
                    var resPagFilters = [ { property: 'operator', value: 'or' } ];
                    
                    for (var prop in pagProperties)
                        resPagFilters.push({property: pagProperties[prop], value: 'like;' + searchText});

                    for (var prop in joinProperties)
                    {
                        resPagFilters.push({property: joinProperties[prop].propertySearch, value: searchText});
                        resPagFilters.push({property: joinProperties[prop].name, value: 'join;' + joinProperties[prop].propertyJoin});
                    }
                        
                }
                else if (searchArray)
                {
                    var resPagFilters = [ { property: 'operator', value: 'and' } ];
                    searchArray.forEach((element) => {
                                                        if (element.operator == '=' && element.property.name)
                                                            resPagFilters.push({property: element.property.pageProperty || element.property.name, value: 'like;' + element.value});

                                                        if (element.operator == '%' && element.property.name)
                                                            resPagFilters.push({property: element.property.pageProperty || element.property.name, value: 'like;%25' + element.value});

                                                        if (element.operator == '>' && element.property.name)
                                                            resPagFilters.push({property: element.property.pageProperty || element.property.name, value: 'gt;' + element.value});

                                                        if (element.operator == '>=' && element.property.name)
                                                            resPagFilters.push({property: element.property.pageProperty || element.property.name, value: 'gte;' + element.value});

                                                        if (element.operator == '<' && element.property.name)
                                                            resPagFilters.push({property: element.property.pageProperty || element.property.name, value: 'lt;' + element.value});

                                                        if (element.operator == '<=' && element.property.name)
                                                            resPagFilters.push({property: element.property.pageProperty || element.property.name, value: 'lte;' + element.value});

                                                        if (element.operator == '<>' && element.property.name)
                                                            resPagFilters.push({property: element.property.pageProperty || element.property.name, value: 'neq;' + element.value});
                                                     });
                }

                return resPagFilters;
            };

            vm.getFile = function (url, typeFile, fileName)
            {
                var actionSuccess = (response) => { createDownloadFile(response, typeFile, fileName); }
                var actionError = (response) => { _checkActionErrors(response); }

                var config = {
                    method: 'GET',
                    url: url,
                    responseType : 'arraybuffer'
                }

                $http(config).then(actionSuccess, actionError);
            }

            vm.getId = function (entity)
            {
                if (entity && entity instanceof Object && entity[_keyProperty])
                {
                    var valuekey = entity[_keyProperty];                
                    if ( isNaN(valuekey) )
                        return valuekey;
                    else
                        return parseInt(valuekey);
                }                     

                return null;
            };

            vm.isNewEntity = function(entity)
            {
                return vm.getId(entity) == null;
            };

            vm.isProcessedEntity = function(entity)
            {
                return EntifixMetadata.isProcessedEntity(resourceName, entity);
            };

            vm.getStartDateProperty = function()
            {
                return EntifixMetadata.getStartDateProperty(resourceName);
            }

            vm.getEndDateProperty = function()
            {
                return EntifixMetadata.getEndDateProperty(resourceName);
            }

            vm.getNotApplyProperty = function()
            {
                return EntifixMetadata.getNotApplyProperty(resourceName);
            }

            function isFormDataRequest()
            {
                return EntifixMetadata.isFormDataRequest(resourceName);
            }

            function filterProperties(properties, columnsSelected)
            {
                var filterProp = [];
                columnsSelected.forEach((cs) => { 
                                                    var filter = properties.filter((p) => { return getDisplay(p) == cs });
                                                    if (filter.length > 0)
                                                        filterProp.push(filter[0]); 
                                                });
                return filterProp;
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
                return stringToClean.charAt(0).toUpperCase() + stringToClean.substring(1, stringToClean.length);
            }

            function createDownloadFile(response, typeFile, fileName)
            {
                var type = typeFile || null;
                var blob = new Blob([response.data], {type: type});
                var blobURL = (window.URL || window.webkitURL).createObjectURL(blob);
                var anchor = document.createElement("a");
                anchor.download = fileName || resourceName;
                anchor.href = blobURL;
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            }

            // Events management
            function addNewEvent(eventCallback, eventType)
            {
                if (_events)
                {
                    if (_events.filter( (e)=>{ return e.callback === eventCallback && e.type == eventType; } ).length == 0)
                        _events.push( { callback: eventCallback, type: eventType } );
                }
                else
                    _events = [ { callback: eventCallback, type: eventType } ];
            };

            function runTriggers(eventType, args)
            {
                if (_events && _events.length > 0)
                    _events.filter((e)=>{ return e.type == eventType; }).forEach((e)=>{ e.callback(args); });                
            };

            vm.listenSave = function(callback)
            {
                addNewEvent(callback, _eventType.save);
            };

            vm.listenSaved = function(callback)
            {
                addNewEvent(callback, _eventType.saved);
            };

            vm.listenDelete = function(callback)
            {
                addNewEvent(callback, _eventType.delete);
            };

            vm.listenDeleted = function(callback)
            {
                addNewEvent(callback, _eventType.deleted);
            };

            vm.listenLoad = function(callback)
            {
                addNewEvent(callback, _eventType.load);
            };

            vm.listenLoaded = function(callback)
            {
                addNewEvent(callback, _eventType.loaded);
            };

            vm.listenErrorSave = function(callback)
            {
                addNewEvent(callback, _eventType.errorSave);
            };

            vm.listenErrorDelete = function(callback)
            {
                addNewEvent(callback, _eventType.errorDelete);
            };

            vm.listenErrorLoad = function(callback)
            {   
                addNewEvent(callback, _eventType.errorLoad);
            };

            vm.listenNonValidSave = function(callback)
            {
                addNewEvent(callback, _eventType.nonValidSave);
            };

            vm.clearEvents = function()
            {
                _events = [];
            };

            //==============================================================================================================================================================================

        };


        return resource;
    };




})();