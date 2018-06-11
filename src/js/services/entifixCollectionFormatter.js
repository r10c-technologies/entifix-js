(function(){
    'use strict';

    angular.module('entifix-js').factory('EntifixCollectionFormatter', factory);

    factory.$inject = ['EntifixDateGenerator'];

    function factory (EntifixDateGenerator)
    {
        return function()
        {
            var vm = this;

            // Properties and fields
            // =========================================================================================================================

            // Fields
            var _transformValues = [];

            // Properties
            
            // =========================================================================================================================


            // Methods
            // =========================================================================================================================

            function activate()
            {

            };

            function getFilters(collection, singleParam)
            {
                var filters = [{ property: 'operator', value: 'or' }];
                collection.forEach(
                    (element) => {
                        if (element[singleParam.property])
                            filters.push({ property: singleParam.resource.getKeyProperty.get(), value: element[singleParam.property]});
                    }
                );
                return filters;
            }

            function processProperty(collection, singleParam, onEnd)
            {
                if (singleParam.type == 'navigation')
                {
                    if (!(_transformValues && _transformValues.length > 0 && _transformValues.filter((tv) => { return tv.property == singleParam.property }).length > 0 ))
                    {
                        var filters = getFilters(collection, singleParam);
                        singleParam.resource.getEnumerationBind(
                                                                singleParam.display, 
                                                                (enumeration) => {  
                                                                    _transformValues.push( { property: singleParam.property, enumResult: enumeration } );
                                                                    transformValue(collection, singleParam, onEnd);
                                                                },
                                                                null,
                                                                filters
                        );
                    }
                    transformValue(collection, singleParam, onEnd);
                }
                else {
                    transformValue(collection, singleParam, onEnd);
                }
            };

            function transformValue(collection, singleParam, onEnd)
            {
                collection.forEach((element)=>
                {
                    var value = element[singleParam.property]; 
                                    
                    //Transform dates
                    if (value && singleParam.type == 'date'|| singleParam.type == 'datetime')
                    {
                        var dateGenerator = new EntifixDateGenerator();
                        if (value && !(value instanceof Date))
                            var asDate = dateGenerator.transformStringToDate(value);
                        else if (value)
                            var asDate = value;
                        else
                            var asDate = null;

                        element[(singleParam.outProperty || singleParam.property)] = dateGenerator.transformDateToString(asDate, singleParam.type, true);
                        onEnd();
                    }

                    //Transform navigation
                    if (singleParam.type == 'navigation')
                    {
                        var transform = () =>
                        {
                            var tempCollectionConf = _transformValues.filter( (tv) => { return tv.property == singleParam.property });
                            if (tempCollectionConf.length > 0)
                            {
                                var tempCollectionValues = tempCollectionConf[0].enumResult;
                                if (tempCollectionValues && tempCollectionValues.length > 0)
                                {
                                    var idValue = value;
                                    if (value instanceof Object)
                                        idValue = singleParam.resource.getId(value);

                                    var tempValues = tempCollectionValues.filter( (enumValue) => { return enumValue.Value == idValue; } );
                                    if (tempValues.length > 0)
                                        element[(singleParam.outProperty || singleParam.property)] = tempValues[0].Display;

                                    onEnd();
                                }
                            }
                        };

                        if (_transformValues && _transformValues.length > 0 && _transformValues.filter( (tv) => { return (tv.property == singleParam.property && tv.enumResult.length) }).length > 0)
                            transform();
                    }

                    if (singleParam.type == 'bool')
                    {
                        if (value)
                            element[(singleParam.outProperty || singleParam.property)] = 'Si';
                        else
                            element[(singleParam.outProperty || singleParam.property)] = 'No';
                    }

                });
            }

            //parameters: Object
            // -> { collection, type, resource, property, display, outProperty }
            vm.transform = function(parameters)
            {                
                return new Promise((resolve, reject)=>
                {
                    processProperty(parameters.collection, parameters, () => {
                        resolve();
                    })                
                });                
            };

            //parameters: Object
            // -> { collection, properties [ {type, resource, property, display, outProperty} ] }
            vm.transformMultiple = function(parameters)
            {
                _transformValues = [];
                return new Promise((resolve, reject)=>
                {
                    var transformed = 0;
                    var steps = 0;

                    parameters.properties.forEach((propertyParams) => {
                        processProperty(parameters.collection, propertyParams, ()=>{
                            transformed++;
                            if (transformed >= parameters.collection.length)
                            {
                                transformed = 0;
                                steps++;
                                if (steps >= parameters.properties.length)
                                    resolve();
                            }
                        });
                    });           
                });                
            };

            // =========================================================================================================================

            // Constructor call
            activate();
        };
    };

})();