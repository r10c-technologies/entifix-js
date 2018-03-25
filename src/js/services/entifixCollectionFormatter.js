

(function(){
    'use strict';

    angular.module('entifix-js').factory('EntifixCollectionFormatter', factory);

    factory.$inject = [];

    function factory ()
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
                    if (singleParam.type == 'date'|| singleParam.type == 'datetime')
                    {
                        var asDate = new Date(value);
                        var year = asDate.getFullYear();
                        var month = (asDate.getMonth() + 1).toString();
                        var day = asDate.getDate().toString();

                        if (month.length < 2)
                            month = '0' + month;
                        if (day.length < 2)
                            day = '0' + day;

                        if (singleParam.type == 'datetime')
                        {
                            var hours = asDate.getHours().toString();
                            var minutes = asDate.getMinutes().toString();
                            var seconds = asDate.getSeconds().toString();
                            if (hours.length < 2)
                                hours = '0' + hours;
                            if (minutes.length < 2)
                                minutes = '0' + minutes;
                            if (seconds.length < 2)
                                seconds = '0' + seconds;
                            element[(singleParam.outProperty || singleParam.property)] = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
                        }
                        else
                            element[(singleParam.outProperty || singleParam.property)] = day + '/' + month + '/' + year;

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