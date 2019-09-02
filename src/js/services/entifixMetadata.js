(function(){
    'use strict';

    angular
        .module('entifix-js')
        .service('EntifixMetadata', service);

    service.$inject = [];

    function service()
    {
        let vm = this;

        // Properties and Fields========================================================================================================================================================
        //==============================================================================================================================================================================

        vm.metadata = 
        {
            get: () => { return globalMetadata; } 
        };
        
        //==============================================================================================================================================================================
        // Methods _____________________________________________________________________________________________________________________________________________________________________
        //==============================================================================================================================================================================

        vm.getDefinedMembers = (resourceName) =>
        {
            let allDefinedMembers = getResource(resourceName).definedMembers || [];

            if (!getResource(resourceName).denyInheritance)
            {
                let base = getBase(resourceName);
    
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

        vm.getExcludedMembers = (resourceName) =>
        {            
            let allExcludedMembers = getResource(resourceName).excludeMembers || [];

            let base = getBase(resourceName);

            while (base) 
            {
                if (base.excludeMembers)
                    allExcludedMembers = allExcludedMembers.concat(base.excludeMembers);

                base = getBase(base.name);
            }

            return allExcludedMembers;
        };

        vm.getTransformProperties = (resourceName) =>
        {
            return vm.getDefinedMembers(resourceName).filter( (p) => { return p.transformType && p.transformType != "false"; });         
        };

        vm.getPaginableProperties = (resourceName) =>
        {
            return vm.getDefinedMembers(resourceName).filter( (p) => { return p.paginable == 'true' || p.paginable == true; });
        };

        vm.getJoinProperties = (resourceName) =>
        {
            return vm.getDefinedMembers(resourceName).filter( (p) => { return p.joinable; });
        };

        vm.getKeyProperty = (resourceName) =>
        {
            let resource = getResource(resourceName);
            let keyProperty = resource.keyProperty;
            let base = getBase(resourceName);

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

        vm.getOpProperty = (resourceName) =>
        {
            let resource = getResource(resourceName);
            let opProperty = resource.opProperty;
            let base = getBase(resourceName);

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
        
        vm.getResourceURL = (resourceName) =>
        {
            let resource = getResource(resourceName);

            let path = resource.url;

            let base = getBase(resourceName);

            while (base) 
            {
                if (base && base.url)
                    path = base.url + '/' + path;

                base = getBase(base.name);
            }

            return path;            
        };

        vm.getTypeInfo = (resourceName) =>
        {
            let resource = getResource(resourceName);
            let typeInfo = resource.type;

            if (!typeInfo)
            {
                let base = getBase(resourceName);
                while (base && !typeInfo) 
                {
                    if (base.type)
                        typeInfo = base.type;

                    base = getBase(base.name);
                }
            }
            
            return typeInfo;
        };

        vm.allowUrlPrefix = (resourceName) =>
        {
            let resource = getResource(resourceName);
            let allowPrefix = resource.allowUrlPrefix;

            if (!allowPrefix)
            {
                let base = getBase(resourceName);
                while (base && !allowPrefix) 
                {
                    allowPrefix = base.allowUrlPrefix;
                    base = getBase(base.name);
                }
            }
            
            return allowPrefix || false;
        };

        vm.allowUrlPostfix = (resourceName) =>
        {
            let resource = getResource(resourceName);
            let allowPostfix = resource.allowUrlPostfix;

            if (!allowPostfix)
            {
                let base = getBase(resourceName);
                while (base && !allowPostfix) 
                {
                    allowPostfix = base.allowPostfix;
                    base = getBase(base.name);
                }
            }
            
            return allowPostfix || false;
        };

        vm.denyBarPrefix = (resourceName) =>
        {
            let resource = getResource(resourceName);
            return resource.denyBarPrefix || false;
        };

        vm.getDefaultUrl = (resourceName) =>
        {
            let resource = getResource(resourceName);
            let defaultUrl = resource.defaultUrl;

            if (!defaultUrl)
                defaultUrl = 'default';
            
            return defaultUrl;
        }
        
        vm.getRequestOptions = (resourceName) =>
        {
            let resource = getResource(resourceName);
            if(resource.requestOptions != null || resource.requestOptions != undefined)
                return resource.requestOptions;
            else {
                return undefined;
            }
        }
        
        vm.getStartDateProperty = (resourceName) =>
        {
            let definedMembers = vm.getDefinedMembers(resourceName);
            let startProperty = null;

            if (definedMembers.length > 0)
                definedMembers.forEach((dm) => { if (dm.startDate) { startProperty = dm.name; return false; } else return true; });
            
            return startProperty;
        }
        
        vm.getEndDateProperty = (resourceName) =>
        {
            let definedMembers = vm.getDefinedMembers(resourceName);
            let endProperty = null;

            if (definedMembers.length > 0)
                definedMembers.every((dm) => { if (dm.endDate) { endProperty = dm.name; return false; } else return true; });
            
            return endProperty;
        }
        
        vm.getNotApplyProperty = (resourceName) =>
        {
            let definedMembers = vm.getDefinedMembers(resourceName);
            let notApplyProperty = null;

            if (definedMembers.length > 0)
                definedMembers.every((dm) => { if (dm.notApply){ notApplyProperty = dm.name; return false; } else return true; });
            
            return notApplyProperty;
        }

        vm.isProcessedEntity = (resourceName, entity) =>
        {
            let definedMembers = vm.getDefinedMembers(resourceName);
            let processedProperty, processedValue;

            if (definedMembers.length > 0)
                definedMembers.every((dm) => { if (dm.processedValue) { processedProperty = dm.name; processedValue = dm.processedValue; return false; } else return true; });

            if (entity[processedProperty] == processedValue)
                return true;
            return false;
        }

        vm.getBodyDataFile = (options) =>
        {
            return {
                title: options.title,
                columns: getBodyDataFileColumns(options),
                tableStriped: options.tableStriped != undefined ? options.tableStriped : "true",
                pageSize: options.pageSize || "Letter",
                pageOrientation: options.pageOrientation || "Landscape",
                data: getBodyDataFilePdfXls(options)
            };
        }
        
        //==============================================================================================================================================================================
        // Utilities ===================================================================================================================================================================
        //==============================================================================================================================================================================

        function getBase(resourceName)
        {
            let resource = globalMetadata.resources.filter((r) => { return r.name == resourceName; })[0];

            if (resource.base)
                return globalMetadata.resources.filter((r) => { return r.name == resource.base; })[0];
            
            return null;
        };
        
        function getResource(resourceName)
        {
            return globalMetadata.resources.filter((r) => { return r.name == resourceName; })[0];
        };

        function getBodyDataFileColumns(options) {
            let columns = [];

            options.columns.forEach((column, index) => { columns.push({ description: column.display, columnName: "Field_" + (index + 1) }) });

            return columns;
        }

        function getBodyDataFilePdfXls(options) {
            let data = [];

            options.data.forEach((row) => {
                let dataRow = {};
                options.columns.forEach((column, index) => { dataRow["Field_" + (index + 1)] = row[column.name] || "" });
                data.push(dataRow);
            });

            return data;
        }
        
        //==============================================================================================================================================================================
    };
})();