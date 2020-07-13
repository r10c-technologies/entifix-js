(function () {
    'use strict';

    angular
        .module('entifix-js')
        .factory('EntifixResource', resource);

    resource.$inject = ['$http', 'EntifixMetadata', 'EntifixErrorManager', 'EntifixDateGenerator'];

    function resource($http, EntifixMetadata, EntifixErrorManager, EntifixDateGenerator) {
        var resource = function (resourceName) {
            var vm = this;

            // REQUESTS _____________________________________________________________________________________________________________________________________________________________________
            //==============================================================================================================================================================================

            var GET = (actionSuccess, actionError, stringQueryParams, suffixUrl, returnPromise) => {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                if (suffixUrl)
                    tempUrl = tempUrl + "/" + suffixUrl;

                if (stringQueryParams)
                    tempUrl = tempUrl + stringQueryParams;

                actionError = actionError || _defaultActionError;

                var requestConfig = { method: "GET", url: tempUrl };

                if (returnPromise) 
                    return $http(requestConfig).then(result => {
                        // Add only for GET trigger scenario
                        runTriggers(_eventType.loaded, result);
                        return result;
                    }); 
                else 
                    $http(requestConfig).then(actionSuccess, actionError);
            };

            var POST = (data, actionSuccess, actionError) => {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                actionError = actionError || _defaultActionError;
                data = transformDataToRequest(data);

                let options = { method: "POST", url: tempUrl, data: data };
                let extraOptions = getRequestOptions();

                if (extraOptions) {
                    options.headers = extraOptions.headers;
                }
                $http(options).then(actionSuccess, actionError);
            };

            var PUT = (data, actionSuccess, actionError) => {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                actionError = actionError || _defaultActionError;
                data = transformDataToRequest(data);

                let options = { method: "PUT", url: tempUrl, data: data };
                let extraOptions = getRequestOptions();

                if (extraOptions) {
                    options.headers = extraOptions.headers;
                }
                $http(options).then(actionSuccess, actionError);
            };

            var DELETE = (id, actionSuccess, actionError) => {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                var tempUrl = tempUrl + "/" + id;
                actionError = actionError || _defaultActionError;

                let options = { method: "DELETE", url: tempUrl };
                $http(options).then(actionSuccess, actionError);
            };

            var PATCH = (data, actionSuccess, actionError) => {
                //Base URL for the resource
                var tempUrl = getBaseUrl();

                actionError = actionError || _defaultActionError;
                data = transformDataToRequest(data);

                let options = { method: "PATCH", url: tempUrl, data: data };
                let extraOptions = getRequestOptions();

                if (extraOptions) {
                    options.headers = extraOptions.headers;
                }
                $http(options).then(actionSuccess, actionError);
            };

            //Format functions ===>>>>:

            function getBaseUrl() {
                var tempUrl = _resourceUrl;

                var postfix = vm.urlPostfix.get();

                if (postfix) {
                    if (!_denyBarPrefix)
                        tempUrl += "/";
                    tempUrl += postfix;
                }

                return tempUrl;
            };

            function transformDataToRequest(data) {
                // Set type as a property
                var typeInfo = EntifixMetadata.getTypeInfo(resourceName);
                if (typeInfo && data[typeInfo.property] && data[_keyProperty])
                    data[typeInfo.property] = { [typeInfo.property]: typeInfo.value };

                // Transform properties
                var transformProperties = EntifixMetadata.getTransformProperties(resourceName);
                if (transformProperties.length > 0) {
                    for (var i = 0; i < transformProperties.length; i++) {
                        var TProperty = transformProperties[i];

                        if (data[TProperty.name]) {
                            // For entity properties
                            if (TProperty.type == "entity") {
                                var value = data[TProperty.name];

                                if (!isNaN(value)) {
                                    var keyValue = value;
                                    var keyNavigationProperty = TProperty.keyNavigationProperty || EntifixMetadata.getKeyProperty(TProperty.resource);
                                    data[TProperty.name] = { [keyNavigationProperty]: keyValue }
                                }
                            }

                            // For date properties
                            if (TProperty.type == "date" || TProperty.type == "datetime") {
                                if (!(data[TProperty.name] instanceof Date))
                                    var dateValue = EntifixDateGenerator.transformStringToDate(data[TProperty.name]);
                                else
                                    var dateValue = data[TProperty.name];

                                data[TProperty.name] = EntifixDateGenerator.transformDateToString(dateValue, TProperty.type, false);
                            }

                            // Other types of properties to transform....

                            /*if (TProperty.propertyMetaData.type == ?)
                            {

                            }*/
                        }

                    }
                }

                // Remove non persistent and excluded properties/members
                for (var property in data) {
                    if (property.substr(0, 1) == "$")
                        delete (data[property]);
                };
                var excludedMembers = EntifixMetadata.getExcludedMembers(resourceName);
                for (var i = 0; i < excludedMembers.length; i++)
                    delete (data[excludedMembers[i]]);

                // Set type as an object
                if (typeInfo && typeInfo.type) {
                    switch (typeInfo.type) {
                        case "FormData":
                            let formData = new FormData();
                            for (var member in data)
                                formData.append(member, data[member]);
                            data = formData;
                            break;
                    }
                }

                return data;
            };

            function transformDataFromResponse(data) {
                if (data) {
                    //Transform properties
                    var transformProperties = EntifixMetadata.getTransformProperties(resourceName);

                    if (transformProperties.length > 0) {
                        for (var i = 0; i < transformProperties.length; i++) {
                            var TProperty = transformProperties[i];

                            if (data[TProperty.name]) {
                                //For entity properties
                                if (TProperty.type == "entity") {
                                    var objectValue = data[TProperty.name];
                                    var keyNavigationProperty = TProperty.keyNavigationProperty || EntifixMetadata.getKeyProperty(TProperty.resource);
                                    var keyValue = objectValue[keyNavigationProperty];

                                    if (TProperty.propertiesToMembers)
                                        for (var j = 0; j < TProperty.propertiesToMembers.length; j++)
                                            if (TProperty.propertiesToMembers[j] instanceof Object)
                                                data[TProperty.propertiesToMembers[j].to || TProperty.propertiesToMembers[j].name] = objectValue[TProperty.propertiesToMembers[j].name];

                                    data[TProperty.name] = keyValue;
                                }

                                //For date-time properties
                                if (TProperty.type == "date" || TProperty.type == "datetime") {
                                    var objectValue = data[TProperty.name];
                                    if (!(objectValue instanceof Date))
                                        data[TProperty.name] = EntifixDateGenerator.transformStringToDate(objectValue);
                                }

                                //Other types of properties to transform....
                                /*if (TProperty.propertyMetaData.type == ?)
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
            var _urlPostfix;

            var _resourceUrl = EntifixMetadata.getResourceURL(resourceName);
            var _keyProperty = EntifixMetadata.getKeyProperty(resourceName);
            var _opProperty = EntifixMetadata.getOpProperty(resourceName);
            var _allowUrlPrefix = EntifixMetadata.allowUrlPrefix(resourceName);
            var _allowUrlPostfix = EntifixMetadata.allowUrlPostfix(resourceName);
            var _denyBarPrefix = EntifixMetadata.denyBarPrefix(resourceName);

            var _defaultActionError = (error) => {
                _isDeleting = false;
                _isLoading = false;
                _isSaving = false;
            };

            var _checkActionErrors = (error) => {
                switch (error.status) {
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
                    get: () => { return _isLoading; }
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
                    get: () => {
                        if (_allowUrlPrefix && _urlPrefix) {
                            if (_urlPrefix instanceof Object && _urlPrefix.getter)
                                return _urlPrefix.getter();

                            if (_urlPrefix)
                                return _urlPrefix;
                        }

                        return null;
                    },
                    set: (value) => {
                        if (_allowUrlPrefix)
                            _urlPrefix = value;
                    }
                }

            vm.urlPostfix =
                {
                    get: () => {
                        if (_allowUrlPostfix && _urlPostfix) {
                            if (_urlPostfix instanceof Object && _urlPostfix.getter)
                                return _urlPostfix.getter();

                            if (_urlPostfix)
                                return _urlPostfix;
                        }

                        return null;
                    },
                    set: (value) => {
                        if (_allowUrlPostfix)
                            _urlPostfix = value;
                    }
                }

            vm.getCompleteResourceUrl =
                {
                    get: () => {
                        return getBaseUrl();
                    }
                }

            vm.getCompleteFiltersUrl =
                {
                    get: (searchText, searchArray, columnsSelected, constantFilters) => {
                        if (!constantFilters)
                            constantFilters = [];
                        return manageUriFilter(vm.getPagFilters(searchText, searchArray, columnsSelected).concat(constantFilters));
                    }
                }

            vm.getMembersResource =
                {
                    get: () => {
                        return EntifixMetadata.getDefinedMembers(resourceName).filter((member) => { return !member.notDisplay; });
                    }
                }

            vm.getKeyProperty =
                {
                    get: () => {
                        return _keyProperty;
                    }
                }

            vm.getOpProperty =
                {
                    get: () => {
                        return _opProperty;
                    }
                }
            //==============================================================================================================================================================================





            // Methods _____________________________________________________________________________________________________________________________________________________________________
            //==============================================================================================================================================================================



            //Private ===>>>>:

            //Manage request timing
            function createArgs(response) {
                return { message: response.data ? response.data.message : response.data, fullResponse: response };
            };

            function onSaveTransactionEnd(callback, isError) {
                return (response) => {
                    var saveSuccess = response.data && !response.data.isLogicError;

                    if (!_onMultipleStorage && callback)
                        callback(response, saveSuccess);

                    _isSaving = false;

                    if (!(response.status >= 200 && response.status < 300))
                        _checkActionErrors(response);

                    if (isError)
                        runTriggers(_eventType.errorSave, createArgs(response));
                    else if (!_onMultipleStorage) {
                        if (saveSuccess)
                            runTriggers(_eventType.saved, createArgs(response));
                        else
                            runTriggers(_eventType.nonValidSave, createArgs(response));
                    }

                    if (_onMultipleStorage && callback)
                        callback(response);
                };
            };

            function onQueryEnd(callback, isError) {
                return (response) => {
                    isError = isError || response.data && response.data.isLogicError;

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

            function onDeleteTransactionEnd(callback, isError) {
                return (response) => {
                    isError = isError || response.data && response.data.isLogicError;

                    if (!_onMultipleDeletion && callback)
                        callback(response, isError);

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
            function _deleteEntity(idEntity, actionSuccess, actionError) {
                if (_isDeleting != true || _onMultipleDeletion) {
                    _isDeleting = true;
                    runTriggers(_eventType.delete);

                    DELETE(idEntity, onDeleteTransactionEnd(actionSuccess, false), onDeleteTransactionEnd(actionError, true));
                }
            };

            function _insertEntity(entity, actionSuccess, actionError) {
                if (_isSaving != true || _onMultipleStorage) {
                    _isSaving = true;
                    runTriggers(_eventType.save);

                    POST(entity, onSaveTransactionEnd(actionSuccess, false), onSaveTransactionEnd(actionError, true));
                }
            };

            function _updateEntity(entity, actionSuccess, actionError) {
                if (_isSaving != true || _onMultipleStorage) {
                    _isSaving = true;
                    runTriggers(_eventType.save);

                    PUT(entity, onSaveTransactionEnd(actionSuccess, false), onSaveTransactionEnd(actionError, true));
                }
            };

            function _replaceEntity(entity, actionSuccess, actionError) {
                if (_isSaving != true || _onMultipleStorage) {
                    _isSaving = true;
                    runTriggers(_eventType.save);

                    PATCH(entity, onSaveTransactionEnd(actionSuccess, false), onSaveTransactionEnd(actionError, true));
                }
            };

            function findEntity(id, ActionSuccess, ActionError) {
                _isLoading = true;

                var preSuccess = (response) => {
                    _isLoading = true;

                    if (ActionSuccess)
                        ActionSuccess(transformDataFromResponse(response.data ? response.data.data : response.data));

                    _isLoading = false;
                }

                GET(onQueryEnd(preSuccess), onQueryEnd(ActionError), manageUriFilter(id));
            };

            function convertToQueryParams(filters) {
                if (filters) {
                    if (filters instanceof Array) {
                        if (filters.length > 0) {
                            var querystring = "?";
                            for (var i = 0; i < filters.length; i++) {
                                var property = filters[i].property;
                                var value = filters[i].value;
                                var type = filters[i].type || "optional_filter";
                                var operator = filters[i].operator || "=";
                                var sort = filters[i].sort;

                                if (value != null && (property != null || sort != null)) {
                                    //Function filters
                                    if (typeof value == "function") {
                                        var possibleValue = value();
                                        if (possibleValue) {
                                            if (sort)
                                                querystring = querystring + "order_by" + "=" + sort + "|" + possibleValue;
                                            else {
                                                if (property == "skip" || property == "take")
                                                    querystring = querystring + property + "=" + possibleValue;
                                                else
                                                    querystring = querystring + type + "=" + property + "|" + operator + "|" + possibleValue;
                                            }
                                        }
                                    }

                                    //Clasic filters
                                    else {
                                        if (sort)
                                            querystring = querystring + "order_by" + "=" + sort + "|" + value;
                                        else {
                                            if (property === "skip" || property === "take" || type === "custom")
                                                querystring = querystring + property + "=" + value;
                                            else
                                                querystring = querystring + type + "=" + property + "|" + operator + "|" + value;
                                        }
                                    }

                                    //Other types of filters
                                    /*
                                    if/else (...)
                                    {

                                    }
                                    */
                                }

                                if (i < filters.length - 1)
                                    querystring = querystring + "&";
                            }

                            return querystring;
                        }
                        else
                            return null;
                    }
                }

                return null;
            };

            function manageUriFilter(filter) {
                if (filter) {
                    var stringfilter = null;

                    if (!isNaN(filter))
                        stringfilter = "/" + filter;

                    else if (typeof filter === "string")
                        stringfilter = "/" + filter;

                    else if (filter instanceof Array)
                        stringfilter = convertToQueryParams(filter);

                    return stringfilter;
                }

                return null;
            }



            //Public ===>>>>:

            vm.getEntityById = (actionSuccess, actionError, id, suffix_pagination) => {
                _isLoading = true;

                actionError = actionError || _defaultActionError;

                var tempSuffix = null;
                if (suffix_pagination)
                    if (suffix_pagination instanceof Function)
                        tempSuffix = suffix_pagination();

                var preSuccess = (response) => {
                    _isLoading = true;
                    var resultData = response.data ? response.data.data : {};
                    actionSuccess(resultData);
                    _isLoading = false;
                };

                GET(onQueryEnd(preSuccess), onQueryEnd(actionError), manageUriFilter(id), tempSuffix);
            };

            vm.getCollection = (actionSuccess, actionError, filters, suffix_pagination) => {
                _isLoading = true;

                actionError = actionError || _defaultActionError;

                var tempSuffix = null;
                if (suffix_pagination)
                    if (suffix_pagination instanceof Function)
                        tempSuffix = suffix_pagination();

                var preSuccess = (response) => {
                    _isLoading = true;
                    var resultData = response.data ? response.data.data : [];
                    actionSuccess(resultData);
                    _isLoading = false;
                };

                GET(onQueryEnd(preSuccess), onQueryEnd(actionError), manageUriFilter(filters), tempSuffix);
            };

            vm.getEnumerationBind = (DisplayProperty, actionSuccess, actionError, filters) => {
                var operateresults = (results) => {
                    var bindEnum = [];

                    results.forEach(function (element) {
                        bindEnum.push({ Value: element[_keyProperty], Display: element[DisplayProperty], entity: element });
                    });

                    actionSuccess(bindEnum);
                };

                return vm.getCollection(operateresults, actionError, filters);
            };

            vm.getEnumerationBindMultiDisplay = (parameters) => {
                var operateresults = (results) => {
                    var bindEnum = [];

                    results.forEach(element => {
                        if (parameters.displayProperties) {
                            var value = "";
                            parameters.displayProperties.forEach(displayProperty => {
                                if (displayProperty.type)
                                    value += element[displayProperty.property][displayProperty.display] + " - ";
                                else
                                    value += element[displayProperty.property] + " - ";
                            });
                            value = value.substring(0, value.length - 2)
                            bindEnum.push({ Value: element[_keyProperty], Display: value, entity: element });
                        }
                    });

                    parameters.actionSuccess(bindEnum);
                };

                return vm.getCollection(operateresults, parameters.actionError, parameters.filters);
            };

            vm.getDefault = (actionSuccess, actionError) => {
                var defaultURL = EntifixMetadata.getDefaultUrl(resourceName);

                _isLoading = true;

                actionError = actionError || _defaultActionError;

                var preSuccess = (response) => {
                    _isLoading = true;
                    var resultData = response.data ? response.data.data : [];
                    actionSuccess(resultData);
                    _isLoading = false;
                };

                GET(onQueryEnd(preSuccess), onQueryEnd(actionError), null, defaultURL);
            };

            vm.saveEntity = (entity, actionSuccess, actionError) => {
                if (entity[_keyProperty]) {
                    if (entity[_opProperty])
                        _replaceEntity(entity, actionSuccess, actionError);
                    else
                        _updateEntity(entity, actionSuccess, actionError);
                }
                else
                    _insertEntity(entity, actionSuccess, actionError);
            };

            vm.insertEntity = (entity, actionSuccess, actionError) => {
                _insertEntity(entity, actionSuccess, actionError);
            };

            vm.updateEntity = (entity, actionSuccess, actionError) => {
                _updateEntity(entity, actionSuccess, actionError);
            };

            vm.replaceEntity = (entity, actionSuccess, actionError) => {
                _replaceEntity(entity, actionSuccess, actionError);
            }

            vm.deleteEntity = (entity, actionSuccess, actionError) => {
                var id = entity;

                if (entity instanceof Object)
                    id = entity[_keyProperty];

                _deleteEntity(id, actionSuccess, actionError)
            };

            vm.loadAsResource = (entity, ActionSuccess, ActionError) => {
                var id = entity;

                if (entity instanceof Object)
                    id = entity[_keyProperty];

                findEntity(id, ActionSuccess, ActionError);
            };

            vm.getEntityPagination = (pageIndex, pageSize, constFilters, pagFilters, sort) => {
                _isLoading = true;

                var skip = { property: "skip", value: pageIndex };
                var take = { property: "take", value: pageSize };
                var pagUrl = "";

                var allFilters = [skip, take];

                if (constFilters) {
                    if (constFilters instanceof String)
                        pagUrl = constFilters + "/" + pagUrl;
                    if (constFilters instanceof Function)
                        pagUrl = constFilters() ? constFilters() + "/" + pagUrl : pagUrl;
                    if (constFilters instanceof Array && constFilters.length > 0)
                        allFilters = allFilters.concat(constFilters);
                }

                if (pagFilters && pagFilters.length > 0)
                    allFilters = allFilters.concat(pagFilters);

                if (sort && sort.length > 0)
                    allFilters = allFilters.concat(sort);

                return GET(null, null, manageUriFilter(allFilters), pagUrl, true).then(
                    (response) => {
                        var dataPag =
                        {
                            resultSet: response.data ? response.data.data : response.data,
                            total: parseInt(response.data ? response.data.info.total : response.data)
                        }
                        _isLoading = false;
                        return dataPag;
                    },
                    (error) => {
                        _isLoading = false;
                        _checkActionErrors(error);
                    });
            };

            vm.getPagFilters = (searchText, searchArray, columnsSelected) => {
                var resPagFilters = [];
                if (searchText && (!searchArray || searchArray.length <= 0)) {
                    var pagProperties = filterProperties(EntifixMetadata.getPaginableProperties(resourceName), columnsSelected);
                    var joinProperties = filterProperties(EntifixMetadata.getJoinProperties(resourceName), columnsSelected);

                    for (var prop of pagProperties) {
                        if (!prop.type || prop.type === "text" || prop.type === "date" || prop.type === "datetime") {
                            resPagFilters.push({ property: prop.pageProperty || prop.name, value: searchText, operator: "lk" });
                        } else if (prop.type === "boolean" || prop.type === "number") {
                            resPagFilters.push({ property: prop.pageProperty || prop.name, value: searchText, operator: "eq" });
                        }
                    }

                    for (var prop of joinProperties) {
                        resPagFilters.push({ property: joinProperties[prop].propertySearch, value: searchText });
                        resPagFilters.push({ property: joinProperties[prop].name, value: "join;" + joinProperties[prop].propertyJoin });
                    }

                }
                else if (searchArray) {
                    var type = "fixed_filter";
                    searchArray.forEach((element) => { resPagFilters.push({ property: element.property, value: element.value, type: type, operator: element.operator }); });
                }

                return resPagFilters;
            };

            vm.getFile = (options, callbackSuccess, callbackError) => {
                let actionSuccess = callbackSuccess ? callbackSuccess : (response) => { createDownloadFile(response, options); if (options.callbackSuccess) options.callbackSuccess(); };
                let actionError = callbackError ? callbackError : (response) => { _checkActionErrors(response); if (options.callbackError) options.callbackError() };
                let config;

                switch (options.requestType) {
                    case "simple-page":
                        config = { method: "POST", url: getBaseUrl(), data: EntifixMetadata.getBodyDataFile(options), responseType: "arraybuffer" };
                        break;

                    case "all-pages":
                        config = { method: "GET", url: getBaseUrl() + manageUriFilter(vm.getPagFilters(options.searchText, options.searchArray, options.columnsSelected).concat(options.constantFilters)), responseType: "arraybuffer" };
                        break;

                    case "custom-report":
                        config = { method: "POST", url: getBaseUrl(), data: options.data, responseType: "arraybuffer" };
                        break;

                    default:
                        config = { method: options.method, url: getBaseUrl(), data: options.data, responseType: options.responseType }
                }

                if (options.headers)
                    config.headers = options.headers;

                $http(config).then(actionSuccess, actionError);
            }

            vm.getId = (entity) => {
                if (entity && entity instanceof Object && entity[_keyProperty]) {
                    var valuekey = entity[_keyProperty];
                    if (isNaN(valuekey))
                        return valuekey;
                    else
                        return parseInt(valuekey);
                }

                return null;
            };

            vm.isNewEntity = (entity) => {
                return vm.getId(entity) == null;
            };

            vm.isProcessedEntity = (entity) => {
                return EntifixMetadata.isProcessedEntity(resourceName, entity);
            };

            vm.getStartDateProperty = () => {
                return EntifixMetadata.getStartDateProperty(resourceName);
            }

            vm.getEndDateProperty = () => {
                return EntifixMetadata.getEndDateProperty(resourceName);
            }

            vm.getNotApplyProperty = () => {
                return EntifixMetadata.getNotApplyProperty(resourceName);
            }

            function getRequestOptions() {
                return EntifixMetadata.getRequestOptions(resourceName);
            }

            function filterProperties(properties, columnsSelected) {
                var filterProp = [];
                columnsSelected.forEach((cs) => {
                    var filter = properties.filter((property) => { return property.display === cs });
                    if (filter.length > 0 && !filter[0].alwaysExclude) {
                        filterProp.push(filter[0]);
                    }
                });

                properties.forEach((property) => {
                    if (property.alwaysInclude) {
                        var contains = filterProp.includes(property);
                        if (!contains) {
                            filterProp.push(property);
                        }
                    }
                });
                return filterProp;
            }

            function createDownloadFile(response, options) {
                var type = options.contentType || null;
                var blob = new Blob([response.data], { type: type });
                var blobURL = (window.URL || window.webkitURL).createObjectURL(blob);
                var anchor = document.createElement("a");
                anchor.download = options.fileName;
                anchor.href = blobURL;
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            }

            // Events management
            function addNewEvent(eventCallback, eventType) {
                if (_events) {
                    if (_events.filter((e) => { return e.callback === eventCallback && e.type == eventType; }).length == 0)
                        _events.push({ callback: eventCallback, type: eventType });
                }
                else
                    _events = [{ callback: eventCallback, type: eventType }];
            };

            function runTriggers(eventType, args) {
                if (_events && _events.length > 0)
                    _events.filter((e) => { return e.type == eventType; }).forEach((e) => { e.callback(args); });
            };

            vm.listenSave = (callback) => {
                addNewEvent(callback, _eventType.save);
            };

            vm.listenSaved = (callback) => {
                addNewEvent(callback, _eventType.saved);
            };

            vm.listenDelete = (callback) => {
                addNewEvent(callback, _eventType.delete);
            };

            vm.listenDeleted = (callback) => {
                addNewEvent(callback, _eventType.deleted);
            };

            vm.listenLoad = (callback) => {
                addNewEvent(callback, _eventType.load);
            };

            vm.listenLoaded = (callback) => {
                addNewEvent(callback, _eventType.loaded);
            };

            vm.listenErrorSave = (callback) => {
                addNewEvent(callback, _eventType.errorSave);
            };

            vm.listenErrorDelete = (callback) => {
                addNewEvent(callback, _eventType.errorDelete);
            };

            vm.listenErrorLoad = (callback) => {
                addNewEvent(callback, _eventType.errorLoad);
            };

            vm.listenNonValidSave = (callback) => {
                addNewEvent(callback, _eventType.nonValidSave);
            };

            vm.clearEvents = () => {
                _events = [];
            };

            //==============================================================================================================================================================================

        };


        return resource;
    };




})();