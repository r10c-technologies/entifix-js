(function(){
    'use strict';

    angular
        .module('entifix-js')
        .service('EntifixMetadata', service);

    service.$inject = ['$http'];

    function service($http)
    {
        var vm = this;

        // Properties and Fields========================================================================================================================================================
        //==============================================================================================================================================================================

        vm.metadata = 
        {
            get: () => { return globalMetadata; } 
        };
        
        //==============================================================================================================================================================================
        // Methods _____________________________________________________________________________________________________________________________________________________________________
        //==============================================================================================================================================================================

        vm.getDefinedMembers = function(resourceName)
        {
            var allDefinedMembers = getResource(resourceName).definedMembers || [];

            if (!getResource(resourceName).denyInheritance)
            {
                var base = getBase(resourceName);
    
                while (base) 
                {
                    if (base.definedMembers)
                        allDefinedMembers = allDefinedMembers.concat(base.definedMembers);
    
                    if (base.denyInheritance)
                        base = null;
                    else
                        base = getBase(base.name);
                }
            }

            return allDefinedMembers;
        };

        vm.getExcludedMembers = function(resourceName)
        {            
            var allExcludedMembers = getResource(resourceName).excludeMembers || [];

             var base = getBase(resourceName);

            while (base) 
            {
                if (base.excludeMembers)
                    allExcludedMembers = allExcludedMembers.concat(base.excludeMembers);

                base = getBase(base.name);
            }

            return allExcludedMembers;
        };

        vm.getTransformProperties = function(resourceName)
        {
            return vm.getDefinedMembers(resourceName).filter( (p) => { return p.transformType; });         
        };

        vm.getPaginableProperties = function(resourceName)
        {
            return vm.getDefinedMembers(resourceName).filter( (p) => { return p.paginable; });
        };

        vm.getJoinProperties = function(resourceName)
        {
            return vm.getDefinedMembers(resourceName).filter( (p) => { return p.joinable; });
        };

        vm.getResourceProperties = function(resourceName)
        {
            return vm.getDefinedMembers(resourceName);
        };

        vm.getKeyProperty = function(resourceName)
        {
            var resource = getResource(resourceName);
            var keyProperty = resource.keyProperty;
            var base = getBase(resourceName);

            while (base && !keyProperty) 
            {
                if (base.keyProperty)
                    keyProperty = base.keyProperty;

                base = getBase(base.name);
            }            

            if (!keyProperty)
                keyProperty = 'id'; //default value for key property
            
            return keyProperty;
        };

        vm.getOpProperty = function(resourceName)
        {
            var resource = getResource(resourceName);
            var opProperty = resource.opProperty;
            var base = getBase(resourceName);

            while (base && !opProperty) 
            {
                if (base.opProperty)
                    opProperty = base.opProperty;

                base = getBase(base.name);
            }            

            if (!opProperty)
                opProperty = 'op'; //default value for key property
            
            return opProperty;
        };
        
        vm.getResourceURL = function(resourceName)
        {
            var path = getResource(resourceName).url;

            var base = getBase(resourceName);

            while (base) 
            {
                if (base && base.url)
                    path = base.url + '/' + path;

                base = getBase(base.name);
            }

            return path;            
        };

        vm.getTypeInfo = function(resourceName)
        {
            var resource = getResource(resourceName);
            var typeInfo = resource.type;

            if (!typeInfo)
            {
                var base = getBase(resourceName);
                while (base && !typeInfo) 
                {
                    if (base.type)
                        typeInfo = base.type;

                    base = getBase(base.name);
                }
            }
            
            return typeInfo;
        };

        vm.allowUrlPrefix = function(resourceName)
        {
            var resource = getResource(resourceName);
            var allowPrefix = resource.allowUrlPrefix;

            if (!allowPrefix)
            {
                var base = getBase(resourceName);
                while (base && !allowPrefix) 
                {
                    allowPrefix = base.allowUrlPrefix;
                    base = getBase(base.name);
                }
            }
            
            return allowPrefix || false;
        };

        vm.denyBarPrefix = function(resourceName)
        {
            var resource = getResource(resourceName);
            return resource.denyBarPrefix || false;
        };

        vm.getDefaultUrl = function(resourceName)
        {
            var resource = getResource(resourceName);
            var defaultUrl = resource.defaultUrl;

            if (!defaultUrl)
                defaultUrl = 'default';
            
            return defaultUrl;
        }
        
        vm.isFormDataRequest = function(resourceName)
        {
            var resource = getResource(resourceName);
            var formDataRequest = resource.formDataRequest;

            if (!formDataRequest)
                return false
            
            return true;
        }
        
        vm.getStartDateProperty = function(resourceName)
        {
            var definedMembers = vm.getDefinedMembers(resourceName);
            var startProperty = null;

            if (definedMembers.length > 0)
                definedMembers.forEach((dm) => { if (dm.startDate) { startProperty = dm.name; return false; } else return true; });
            
            return startProperty;
        }
        
        vm.getEndDateProperty = function(resourceName)
        {
            var definedMembers = vm.getDefinedMembers(resourceName);
            var endProperty = null;

            if (definedMembers.length > 0)
                definedMembers.every((dm) => { if (dm.endDate) { endProperty = dm.name; return false; } else return true; });
            
            return endProperty;
        }
        
        vm.getNotApplyProperty = function(resourceName)
        {
            var definedMembers = vm.getDefinedMembers(resourceName);
            var notApplyProperty = null;

            if (definedMembers.length > 0)
                definedMembers.every((dm) => { if (dm.notApply){ notApplyProperty = dm.name; return false; } else return true; });
            
            return notApplyProperty;
        }

        vm.isProcessedEntity = function(resourceName, entity)
        {
            var definedMembers = vm.getDefinedMembers(resourceName);
            var processedProperty, processedValue;

            if (definedMembers.length > 0)
                definedMembers.every((dm) => { if (dm.processedValue) { processedProperty = dm.name; processedValue = dm.processedValue; return false; } else return true; });

            if (entity[processedProperty] == processedValue)
                return true;
            return false;
        }
        
        //==============================================================================================================================================================================
        // Utilities ===================================================================================================================================================================
        //==============================================================================================================================================================================

        function getBase(resourceName)
        {
            var resource = globalMetadata.resources.filter((r) => { return r.name == resourceName; })[0];

            if (resource.base)
                return globalMetadata.resources.filter((r) => { return r.name == resource.base; })[0];
            
            return null;
        };
        
        function getResource(resourceName)
        {
            return globalMetadata.resources.filter((r) => { return r.name == resourceName; })[0];
        };   
        
        //==============================================================================================================================================================================
    };
})();