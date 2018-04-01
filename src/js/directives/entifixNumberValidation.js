(function(){
    'use strict';
 
    angular.module('entifix-js').directive('entifixNumberValidation', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                if (attrs.numberValidation == "true")
                {
                    ctrl.$parsers.push(function(value) {
                        if (ctrl.$isEmpty(value)) {
                            ctrl.$setValidity('number', true);
                            return null;
                        }
                        else if (!isNaN(parseFloat(value)) && isFinite(value)) {
                            ctrl.$setValidity('number', true);
                            return value;
                        }
                        else
                            ctrl.$setValidity('number', false);
                    });
                }
            }
        };
    });
})();