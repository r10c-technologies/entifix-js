(function(){
    'use strict';

    //Module creation
    var entifix = angular.module('entifix-js', ['app.config', 'angular-jwt', 'angular-md5', 'entifix-security-management'] )



    //Init components    
    entifix.directive('compile', ['$compile', function ($compile) {
                                            return function(scope, element, attrs) {
                                                scope.$watch(
                                                    function(scope) {
                                                        // watch the 'compile' expression for changes
                                                        return scope.$eval(attrs.compile);
                                                    },
                                                    function(value) {
                                                        // when the 'compile' expression changes
                                                        // assign it into the current DOM
                                                        element.html(value);

                                                        // compile the new DOM and link it to the current
                                                        // scope.
                                                        // NOTE: we only compile .childNodes so that
                                                        // we don't get into infinite loop compiling ourselves
                                                        $compile(element.contents())(scope);
                                                    }
                                                );
                                            };
                                        }]);



    entifix.service('BaseComponentFunctions', service);
    service.$inject = [];
    function service()
    {
        var sv = this;

        //Properties

        //Methods
        sv.CreateStringHtmlComponent = function(componentConstruction)
        {
            var stringbindings = ''; 
            if (componentConstruction.bindings)
                if (componentConstruction.bindings.length > 0)
                    for(var i = 0; i < componentConstruction.bindings.length; i++ )
                        stringbindings += componentConstruction.bindings[i].name + '=' + '"' + componentConstruction.bindings[i].value + '"';          
            
            var stringhtml = '<' + componentConstruction.name;

            if (stringbindings.length > 0)
                stringhtml += ' ' + stringbindings;
            
            stringhtml += '></' + componentConstruction.name + '>';

            return stringhtml;
        }

        sv.CreateStringHtmlComponentAndBindings = function(componentConstruction, bindingConnectionPath)
        {
            var stringbindings = ''; 
            var objectbindings = {};
            if (componentConstruction.bindings)
            {
                if (componentConstruction.bindings.length > 0)
                {
                    for(var i = 0; i < componentConstruction.bindings.length; i++ )
                    {
                        var binding = componentConstruction.bindings[i];
                        var tempstring = binding.name + '=';
                        
                        var isCorrect = false; 

                        //String binding
                        if (typeof binding.value == 'string')
                        {
                            tempstring += '"' + binding.value;
                            isCorrect = true;
                        }; 

                        //Object and Method binding
                        if (!isCorrect && bindingConnectionPath && binding.value != null)
                        {
                            tempstring += '"' + bindingConnectionPath + '.' + binding.name
                            objectbindings[binding.name] = binding.value;
                            isCorrect = true;
                        };

                        if (isCorrect)
                            stringbindings += ' ' + tempstring + (binding.isExecutable ? '()"' : '"');
                    } 
                }         
            }

            var stringhtml = '<' + componentConstruction.name;

            if (stringbindings.length > 0)
                stringhtml += stringbindings;
            
            stringhtml += '></' + componentConstruction.name + '>';

            var result = 
            {
                stringhtml: stringhtml,
                objectbindings: objectbindings
            }

            return result;
        };

        return sv;
    };
    
})();