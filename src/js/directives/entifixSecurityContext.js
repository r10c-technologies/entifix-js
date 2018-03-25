(function(){
    'use strict';
 
    angular.module(entifix-js)
            .directive("entifixSecurityContext",
                        ['entifixSession', '$compile',
                            function(EntifixSession, $compile)
                            {
                                return {
                                        restrict: 'A',
                                        priority:1001,
                                        terminal:true,
                                        scope: {
                                            perm: "&permission"
                                        },
                                        compile: function(element, attributes)
                                                {
                                                    var permission = attributes.entifixSecurityContext;
 
                                                    element.removeAttr('entifix-security-context');
                                                    
                                                    if (EntifixSession.checkPermissions(permission))
                                                        element.attr('ng-if', true);
                                                    else
                                                        element.attr('ng-if', false);
 
                                                    var fn = $compile(element);
                                                    return function(scope){ fn(scope); };
                                                }
                                        };
                            }]
                        );
})();