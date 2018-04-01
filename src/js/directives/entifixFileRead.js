(function(){
    'use strict';
 
    angular.module('entifix-js').directive("entifixFileread", [function () {
        return {
            require: "ngModel",
            link: function postLink(scope,elem,attrs,ngModel) {
                elem.on("change", function(e) {
                    var files = elem[0].files[0];
                    ngModel.$setViewValue(files);
                })
            }
        }
    }]);
})();