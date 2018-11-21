(function(){
    'use strict';
 
    angular.module('entifix-js').directive("entifixFileRead", [function () {
        return {
            require: "ngModel",
            link: function postLink(scope,elem,attrs,ngModel) {
                elem.on("change", function(e) {
                    if (!attrs.multiple) {
                        var files = elem[0].files[0];
                        ngModel.$setViewValue(files);    
                    } else {
                        var files = elem[0].files;
                        ngModel.$setViewValue(files);
                    }
                })
            }
        }
    }]);
})();